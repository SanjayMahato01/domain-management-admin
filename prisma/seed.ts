
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.create();

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
