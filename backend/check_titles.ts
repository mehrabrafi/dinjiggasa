import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.liveSession.findMany({
    include: {
        series: true,
        scholar: true
    }
  });
  console.log(sessions.map(s => s.title));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
