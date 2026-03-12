import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.liveSession.findMany({
    where: { audioUrl: { not: null } }
  });
  console.log(sessions.map(s => s.audioUrl));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
