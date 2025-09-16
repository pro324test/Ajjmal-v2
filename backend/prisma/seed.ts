import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - uncomment if needed)
  // await prisma.userRoleAssignment.deleteMany();
  // await prisma.user.deleteMany();

  // Hash the test password
  const hashedPassword = await bcrypt.hash('123Qwe', 10);

  // Create test users with different roles
  console.log('Creating test users...');

  // 1. System Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ecme.com' },
    update: {},
    create: {
      email: 'admin@ecme.com',
      phoneNumber: '+218911234567',
      passwordHash: hashedPassword,
      fullName: 'System Administrator',
      isActive: true,
      roles: {
        create: [
          {
            role: UserRole.SYSTEM_STAFF,
            isActive: true,
            isPrimary: true,
          },
        ],
      },
    },
    include: {
      roles: true,
    },
  });

  // 2. Customer User (matches existing demo data)
  const customerUser = await prisma.user.upsert({
    where: { email: 'admin-01@ecme.com' },
    update: {},
    create: {
      email: 'admin-01@ecme.com',
      phoneNumber: '+218911234568',
      passwordHash: hashedPassword,
      fullName: 'Angelina Gotelli',
      isActive: true,
      roles: {
        create: [
          {
            role: UserRole.CUSTOMER,
            isActive: true,
            isPrimary: true,
          },
        ],
      },
    },
    include: {
      roles: true,
    },
  });

  // 3. Vendor User
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@ecme.com' },
    update: {},
    create: {
      email: 'vendor@ecme.com',
      phoneNumber: '+218911234569',
      passwordHash: hashedPassword,
      fullName: 'Ahmed Ali (Vendor)',
      isActive: true,
      roles: {
        create: [
          {
            role: UserRole.VENDOR,
            isActive: true,
            isPrimary: true,
          },
        ],
      },
    },
    include: {
      roles: true,
    },
  });

  // 4. Delivery Person
  const deliveryUser = await prisma.user.upsert({
    where: { email: 'delivery@ecme.com' },
    update: {},
    create: {
      email: 'delivery@ecme.com',
      phoneNumber: '+218911234570',
      passwordHash: hashedPassword,
      fullName: 'Omar Hassan (Delivery)',
      isActive: true,
      roles: {
        create: [
          {
            role: UserRole.DELIVERY_PERSON,
            isActive: true,
            isPrimary: true,
          },
        ],
      },
    },
    include: {
      roles: true,
    },
  });

  // 5. Multi-role user (Customer + Vendor)
  const multiRoleUser = await prisma.user.upsert({
    where: { email: 'multi@ecme.com' },
    update: {},
    create: {
      email: 'multi@ecme.com',
      phoneNumber: '+218911234571',
      passwordHash: hashedPassword,
      fullName: 'Sara Mohamed (Multi-Role)',
      isActive: true,
      roles: {
        create: [
          {
            role: UserRole.CUSTOMER,
            isActive: true,
            isPrimary: true,
          },
          {
            role: UserRole.VENDOR,
            isActive: true,
            isPrimary: false,
          },
        ],
      },
    },
    include: {
      roles: true,
    },
  });

  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📋 Test Users Created:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 All users have password: 123Qwe');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const users = [
    { user: adminUser, role: 'System Admin' },
    { user: customerUser, role: 'Customer (Demo User)' },
    { user: vendorUser, role: 'Vendor' },
    { user: deliveryUser, role: 'Delivery Person' },
    { user: multiRoleUser, role: 'Customer + Vendor' },
  ];

  users.forEach(({ user, role }) => {
    console.log(`\n👤 ${role}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   📱 Phone: ${user.phoneNumber}`);
    console.log(`   👥 Roles: ${user.roles.map(r => r.role).join(', ')}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 You can now test login functionality!');
  console.log('💡 Use any of the emails above with password: 123Qwe');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });