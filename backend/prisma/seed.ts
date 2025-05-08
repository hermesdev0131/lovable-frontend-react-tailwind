import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if the test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!existingUser) {
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('Test user created successfully');
  } else {
    console.log('Test user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });