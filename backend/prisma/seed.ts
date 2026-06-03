// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { dni: '00000000' },
    update: {},
    create: {
      dni: '00000000',
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@consultorio.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('Admin creado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });