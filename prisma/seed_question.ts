import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Find or create the scholar
    const scholar = await prisma.user.upsert({
        where: { email: 'omar.suleiman@example.com' },
        update: {},
        create: {
            name: 'Sheikh Omar Suleiman',
            email: 'omar.suleiman@example.com',
            password: hashedPassword,
            specialization: 'Imam & Scholar',
            bio: 'Founder of Yaqeen Institute and world-renowned Islamic scholar specializing in Tafseer, Ethics, and History.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=11',
        },
    });

    // 2. Find or create the user (Ahmed Khan)
    const user = await prisma.user.upsert({
        where: { email: 'ahmed.khan@example.com' },
        update: {},
        create: {
            name: 'Ahmed Khan',
            email: 'ahmed.khan@example.com',
            password: hashedPassword,
            role: Role.USER,
            avatar: 'https://i.pravatar.cc/150?img=12',
        },
    });

    // 3. Create the question
    const question = await prisma.question.create({
        data: {
            title: 'How can I maintain consistency in Tahajjud prayer when my work schedule is demanding?',
            body: "I struggle with staying consistent with night prayers. I work a 9-to-5 job but often have to stay late or start early. I find it difficult to wake up in the last third of the night and still feel productive during the day. Are there specific strategies from the Seerah or advice for modern professionals to keep this habit alive without burning out?",
            authorId: user.id,
            tags: {
                connectOrCreate: [
                    { where: { name: 'spiritual growth' }, create: { name: 'spiritual growth' } },
                    { where: { name: 'tahajjud' }, create: { name: 'tahajjud' } },
                ]
            },
            answers: {
                create: {
                    content: `"Assalamu Alaikum Ahmed. This is a very common challenge in our modern era, but the beauty of our Deen is its flexibility and focus on intention."\n\nConsistency in Tahajjud is built through small, manageable habits. Don't overburden yourself initially; the Prophet (saw) said, "The most beloved deeds to Allah are those that are consistent, even if they are small." If you cannot wake up for the last third of the night, start by praying two rak’ahs before you go to sleep, or immediately after your Isha prayer. This is still considered part of the night prayer (Qiyam-al-Layl).\n\nSecondly, audit your evening routine. Screen time before bed often drains our spiritual energy and makes it physically harder to wake up. Aim for a 'spiritual wind-down' 30 minutes before sleep. Finally, remember that your work, if done with the right intention to provide for your family and serve the community, is also a form of Ibadah. Do not let the Shaitan make you feel hopeless because you missed one night. Simply renew your intention and try again.\n\nMay Allah make it easy for you and accept your efforts.`,
                    authorId: scholar.id,
                    isAccepted: true,
                }
            }
        }
    });

    console.log(`Question seeded successfully! ID: ${question.id}`);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
