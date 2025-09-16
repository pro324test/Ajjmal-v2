import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { roles, passwordHash, ...userData } = createUserDto;

    // Hash password if it's not already hashed
    const hashedPassword = passwordHash.startsWith('$2') 
      ? passwordHash 
      : await bcrypt.hash(passwordHash, 10);

    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { phoneNumber: userData.phoneNumber },
        ].filter(Boolean),
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or phone number already exists');
    }

    return this.prisma.user.create({
      data: {
        ...userData,
        passwordHash: hashedPassword,
        roles: {
          create: roles?.map(role => ({
            role: role.role as any,
            isActive: role.isActive ?? true,
            isPrimary: role.isPrimary ?? false,
          })) || [{
            role: 'CUSTOMER' as any,
            isActive: true,
            isPrimary: true,
          }]
        },
      },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });
  }

  async findAll(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    status?: 'active' | 'inactive';
  }) {
    const page = params?.page || 1;
    const pageSize = Math.min(params?.pageSize || 10, 100);
    const skip = (page - 1) * pageSize;

    const whereConditions: any[] = [];

    // Search filter
    if (params?.search) {
      whereConditions.push({
        OR: [
          { fullName: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
          { phoneNumber: { contains: params.search } },
        ]
      });
    }

    // Status filter
    if (params?.status === 'active') {
      whereConditions.push({ isActive: true });
    } else if (params?.status === 'inactive') {
      whereConditions.push({ isActive: false });
    }

    // Role filter
    if (params?.role) {
      whereConditions.push({
        roles: {
          some: {
            role: params.role as any,
            isActive: true,
          }
        }
      });
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        include: {
          roles: {
            where: { isActive: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.user.count({
        where: Object.keys(where).length > 0 ? where : undefined,
      }),
    ]);

    return {
      users: users.map(user => ({
        ...user,
        passwordHash: undefined, // Don't return password hash
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          where: { isActive: true },
        },
        staffProfile: true,
        vendorProfile: true,
        customerProfile: true,
        deliveryProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Don't return password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roles, passwordHash, ...userData } = updateUserDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Hash password if provided and not already hashed
    const hashedPassword = passwordHash 
      ? (passwordHash.startsWith('$2') ? passwordHash : await bcrypt.hash(passwordHash, 10))
      : undefined;

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(hashedPassword && { passwordHash: hashedPassword }),
      },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });

    // Update roles if provided
    if (roles) {
      // Deactivate all current roles
      await this.prisma.userRoleAssignment.updateMany({
        where: { userId: id },
        data: { isActive: false },
      });

      // Create or update new roles
      for (const role of roles) {
        await this.prisma.userRoleAssignment.upsert({
          where: {
            userId_role: {
              userId: id,
              role: role.role as any,
            },
          },
          create: {
            userId: id,
            role: role.role as any,
            isActive: role.isActive ?? true,
            isPrimary: role.isPrimary ?? false,
          },
          update: {
            isActive: role.isActive ?? true,
            isPrimary: role.isPrimary ?? false,
          },
        });
      }
    }

    // Return updated user without password
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Soft delete by setting isActive to false
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });
  }

  async assignRole(userId: number, role: string, isPrimary = false) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If setting as primary, remove primary flag from other roles
    if (isPrimary) {
      await this.prisma.userRoleAssignment.updateMany({
        where: { 
          userId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.userRoleAssignment.upsert({
      where: {
        userId_role: {
          userId,
          role: role as any,
        },
      },
      create: {
        userId,
        role: role as any,
        isActive: true,
        isPrimary,
      },
      update: {
        isActive: true,
        isPrimary,
      },
    });
  }

  async removeRole(userId: number, role: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.userRoleAssignment.updateMany({
      where: {
        userId,
        role: role as any,
      },
      data: { isActive: false },
    });
  }
}
