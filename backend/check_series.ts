import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const seriesList = await prisma.series.findMany({
    include: {
        sessions: true
    }
  });
  console.log(JSON.stringify(seriesList, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
