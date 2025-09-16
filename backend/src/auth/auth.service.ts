import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, ValidateCredentialDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          where: { isActive: true },
          include: {
            user: true,
          },
        },
      },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, phoneNumber, password } = loginDto;

    let user;
    if (email) {
      user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          roles: {
            where: { isActive: true },
          },
        },
      });
    } else if (phoneNumber) {
      user = await this.prisma.user.findUnique({
        where: { phoneNumber },
        include: {
          roles: {
            where: { isActive: true },
          },
        },
      });
    }

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: user.roles.map((role) => role.role),
    };

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        roles: user.roles.map((role) => role.role),
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, phoneNumber, password, fullName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        phoneNumber,
        passwordHash: hashedPassword,
        fullName,
      },
    });

    // Assign default customer role
    await this.prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        role: 'CUSTOMER',
        isPrimary: true,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: ['CUSTOMER'],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        roles: ['CUSTOMER'],
      },
    };
  }

  async validateCredential(validateCredentialDto: ValidateCredentialDto) {
    const { email, password } = validateCredentialDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return null;
    }

    return {
      id: user.id.toString(),
      userName: user.fullName,
      email: user.email,
      avatar: null, // Add avatar support later if needed
      roles: user.roles.map((role) => role.role),
    };
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });
  }
}
