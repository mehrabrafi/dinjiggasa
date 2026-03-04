import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const moderator = await prisma.user.upsert({
        where: { email: 'moderator@example.com' },
        update: {},
        create: {
            name: 'System Moderator',
            email: 'moderator@example.com',
            password: hashedPassword,
            role: Role.MODERATOR,
            avatar: 'https://ui-avatars.com/api/?name=Moderator&background=3b82f6&color=fff&bold=true',
        }
    });

    console.log(`Moderator seeded successfully! ID: ${moderator.id}`);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
