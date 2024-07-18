import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const categories = Array.from({ length: 100 }).map(() => ({
    name: faker.commerce.department(),
  }));

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // Skip creating categories if they already exist
  });

  console.log("100 categories have been created successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
