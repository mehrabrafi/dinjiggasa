import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const scholars = [
        {
            name: 'Dr. Ahmed Al-Falahi',
            email: 'ahmed.alfalahi@example.com',
            password: hashedPassword,
            specialization: 'Fiqh & Contemporary Issues',
            bio: 'PhD in Islamic Jurisprudence from Al-Azhar University. Specializes in modern financial transactions and individual guidance on contemporary challenges.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=11',
        },
        {
            name: 'Sheikh Yusuf Rahman',
            email: 'yusuf.rahman@example.com',
            password: hashedPassword,
            specialization: 'Hadith Studies',
            bio: 'Author of several books on Hadith sciences. Focuses on the authentication of narrations and their practical application in the modern world.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=12',
        },
        {
            name: 'Ustadha Amina Zafar',
            email: 'amina.zafar@example.com',
            password: hashedPassword,
            specialization: 'Family & Marriage Counseling',
            bio: 'Certified counselor combining psychological principles with Islamic teachings to help families and individuals navigate life’s complex relationships.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        {
            name: 'Dr. Omar Farooq',
            email: 'omar.farooq@example.com',
            password: hashedPassword,
            specialization: 'Islamic History & Civilization',
            bio: 'Professor of History with a focus on the Golden Age of Islam and its contributions to science and philosophy.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=33',
        },
        {
            name: 'Sheikh Ibrahim Musa',
            email: 'ibrahim.musa@example.com',
            password: hashedPassword,
            specialization: 'Theology (Aqeedah)',
            bio: 'Graduate of Madinah University. Teaches the fundamentals of Islamic belief and spirituality with an emphasis on personal connection with the Creator.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=68',
        },
        {
            name: 'Ustadha Sarah Karim',
            email: 'sarah.karim@example.com',
            password: hashedPassword,
            specialization: 'Youth & Education',
            bio: 'Dedicated to empowering Muslim youth through education and mentorship programs. Focuses on building a strong identity and positive character.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=47',
        },
    ];

    for (const scholar of scholars) {
        await prisma.user.upsert({
            where: { email: scholar.email },
            update: scholar,
            create: scholar,
        });
    }

    console.log('Scholars seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
