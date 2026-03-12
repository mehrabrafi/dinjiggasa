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
        {
            name: 'Dr. Maryam Hassan',
            email: 'maryam.hassan@example.com',
            password: hashedPassword,
            specialization: 'Islamic Bioethics',
            bio: 'Expert in medical ethics from an Islamic perspective, bridging the gap between modern healthcare and spiritual values.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=32',
        },
        {
            name: 'Sheikh Khalid Mansour',
            email: 'khalid.mansour@example.com',
            password: hashedPassword,
            specialization: 'Arabic Linguistics & Tafsir',
            bio: 'Specialist in the linguistic miracles of the Quran and classical Arabic literature.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=15',
        },
        {
            name: 'Dr. Fatima Zahra',
            email: 'fatima.zahra@example.com',
            password: hashedPassword,
            specialization: 'Comparative Religion',
            bio: 'Scholar focusing on interfaith dialogue and the position of Islam among world religions.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=26',
        },
        {
            name: 'Sheikh Bilal Ahmed',
            email: 'bilal.ahmed@example.com',
            password: hashedPassword,
            specialization: 'Islamic Economics',
            bio: 'Expert in Shariah-compliant finance and ethical investment strategies for the modern economy.',
            isVerified: true,
            role: Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=52',
        },
    ];

    console.log('Upserting scholars...');
    const seededScholars = [];
    for (const scholarData of scholars) {
        const s = await prisma.user.upsert({
            where: { email: scholarData.email },
            update: scholarData,
            create: scholarData,
        });
        seededScholars.push(s);
    }
    console.log('Scholars seeded successfully!');

    // Create a regular user for asking questions
    const regularUser = await prisma.user.upsert({
        where: { email: 'common.user@example.com' },
        update: {},
        create: {
            name: 'Common User',
            email: 'common.user@example.com',
            password: hashedPassword,
            role: Role.USER,
            avatar: 'https://i.pravatar.cc/150?img=20',
        }
    });

    const qaPairs = [
        {
            title: 'How to maintain focus (Khushu) in prayer?',
            body: 'I find my mind wandering a lot during Salah. What are some practical steps to improve my concentration and feel more connected to Allah?',
            tags: ['prayer', 'spirituality', 'khushu'],
            scholarIndex: 4, // Sheikh Ibrahim Musa (Theology)
            answer: 'Achieving Khushu starts before the prayer itself. Perform your Wudu mindfully, and spend a few moments in quiet reflection before starting. During Salah, try to understand the meaning of the verses you are reciting. If your mind wanders, gently bring it back without frustration. Remember, you are standing before the Creator of the universe.'
        },
        {
            title: 'Is investing in cryptocurrency Shariah-compliant?',
            body: 'I am interested in Bitcoin and other digital assets. What are the main considerations for a Muslim investor to ensure their wealth is Halal?',
            tags: ['finance', 'crypto', 'halal'],
            scholarIndex: 9, // Sheikh Bilal Ahmed (Economics)
            answer: 'The permissibility of cryptocurrency depends on its nature as a medium of exchange and the presence of excessive uncertainty (Gharar). Most scholars agree that if a coin has utility and is not used for gambling or illegal activities, it can be considered permissible. However, one must avoid purely speculative trading that resembles gambling.'
        },
        {
            title: 'Dealing with anxiety from an Islamic perspective',
            body: 'I often feel overwhelmed by the state of the world and personal health. How can I use my faith to cope with these feelings of anxiety?',
            tags: ['mental health', 'faith', 'anxiety'],
            scholarIndex: 2, // Ustadha Amina Zafar (Counseling)
            answer: 'Faith is a powerful anchor. Recognize that while we do our part, the ultimate outcome is in Allah’s hands (Tawakkul). Reciting Dhikr and the morning/evening Adhkar can bring tranquility to the heart. Islam also encourages seeking professional help; there is no contradiction between trusting Allah and consulting a therapist.'
        },
        {
            title: 'The importance of seeking knowledge for women',
            body: 'Are there any restrictions on what fields of study a Muslim woman can pursue in the modern world?',
            tags: ['education', 'women in islam', 'knowledge'],
            scholarIndex: 5, // Ustadha Sarah Karim (Youth & Education)
            answer: 'Seeking knowledge is an obligation upon every Muslim, male and female. There are no inherent restrictions on fields of study, whether scientific, literary, or religious. In fact, the Ummah needs female experts in every field—medicine, law, engineering, and beyond—to serve the community effectively.'
        },
        {
            title: 'Understanding the concept of "Fate" vs "Free Will"',
            body: 'If everything is already written (Qadr), then why are we held accountable for our actions? I find this concept difficult to grasp.',
            tags: ['theology', 'qadr', 'philosophy'],
            scholarIndex: 4, // Sheikh Ibrahim Musa (Theology)
            answer: 'Allah’s knowledge is outside of time; He knows what we will choose, but He does not force our choice. Think of it like a teacher who knows their students well—they might predict the grades accurately, but the students still did the work themselves. We are responsible for the choices we make within the capacity Allah has given us.'
        },
        {
            title: 'How to raise children with strong Islamic identity in the West?',
            body: 'Living in a non-Muslim majority country, I worry about my kids losing their values. What should be my priority?',
            tags: ['parenting', 'youth', 'identity'],
            scholarIndex: 5, // Ustadha Sarah Karim (Youth & Education)
            answer: 'Make the home a place of love and open dialogue. Instead of just "dos and don’ts," explain the "why" behind our practices. Be a living example of the character you want them to have. Connect them with a community of good peers, and let them see the beauty of Islam through service and kindness.'
        },
        {
            title: 'Historical contributions of Muslims to medicine',
            body: 'I am a medical student and would like to know more about our heritage in this field. Who are some key figures?',
            tags: ['history', 'science', 'medicine'],
            scholarIndex: 3, // Dr. Omar Farooq (History)
            answer: 'Muslim scholars like Ibn Sina (Avicenna), whose "Canon of Medicine" was the standard text in Europe for centuries, and Al-Razi, a pioneer in pediatrics and ophthalmology, made massive contributions. They founded the first hospitals (Bimaristans) and insisted on clinical observation and experimentation.'
        },
        {
            title: 'Is organ donation allowed in Islam?',
            body: 'If I want to be an organ donor after I pass away, is this considered permissible according to modern Fiqh?',
            tags: ['bioethics', 'fiqh', 'medicine'],
            scholarIndex: 6, // Dr. Maryam Hassan (Bioethics)
            answer: 'Most contemporary Fiqh councils allow organ donation as a form of "Sadaqah Jariyah" (ongoing charity), provided it is done for the purpose of saving lives and does not involve the sale of organs. The preservation of life is one of the higher objectives (Maqasid) of Shariah.'
        },
        {
            title: 'How to study the Quran effectively for a non-Arabic speaker?',
            body: 'I want to connect deeper with the Quran but I don’t speak Arabic. Where should I start?',
            tags: ['quran', 'arabic', 'learning'],
            scholarIndex: 7, // Sheikh Khalid Mansour (Linguistics)
            answer: 'Start with a reputable translation and a concise Tafsir (explanation) like the "Study Quran" or "Tafsir al-Jalalayn." Listen to beautiful recitations while following the meaning. Gradually, try to learn the meaning of common root words. The Quran is a message for all of humanity, and Allah makes it easy for those who seek to understand.'
        },
        {
            title: 'Ethical considerations in AI and technology',
            body: 'As a software engineer, I want to know if there are Islamic principles I should keep in mind while developing algorithms.',
            tags: ['technology', 'ethics', 'ai'],
            scholarIndex: 0, // Dr. Ahmed Al-Falahi (Fiqh)
            answer: 'Islamic ethics emphasize justice, transparency, and avoiding harm (Darar). Algorithms should not perpetuate bias or be used for deceptive purposes. Protecting privacy and ensuring that technology serves the common good (Maslaha) are key principles that every Muslim developer should uphold.'
        }
    ];

    console.log('Upserting questions and answers...');
    for (const qa of qaPairs) {
        const scholar = seededScholars[qa.scholarIndex];

        // We use create if we want many, but here we can just check if title exists to avoid duplicates
        const existingQuestion = await prisma.question.findFirst({
            where: { title: qa.title }
        });

        if (!existingQuestion) {
            await prisma.question.create({
                data: {
                    title: qa.title,
                    body: qa.body,
                    authorId: regularUser.id,
                    acceptedById: scholar.id,
                    tags: {
                        connectOrCreate: qa.tags.map(t => ({
                            where: { name: t },
                            create: { name: t }
                        }))
                    },
                    answers: {
                        create: {
                            content: qa.answer,
                            authorId: scholar.id,
                            isAccepted: true,
                        }
                    }
                }
            });
        }
    }
    console.log('Questions and answers seeded successfully!');

    // --- Seed Series and Live Sessions ---
    console.log('Upserting series and live sessions...');
    
    // 1. Seerah Series
    const seerahSeries = await prisma.series.upsert({
        where: { id: 'series-seerah-1' },
        update: {},
        create: {
            id: 'series-seerah-1',
            title: 'The Seerah of Prophet Muhammad (ﷺ)',
            description: 'A comprehensive look at the life and teachings of the final messenger, from birth to the spread of the message.',
            thumbnailUrl: '/assets/images/mock/seerah.png',
            episodeCount: 12,
            category: 'History',
            scholarId: seededScholars[3].id, // Dr. Omar Farooq (History)
        }
    });

    // 2. Tazkiyah Series
    const tazkiyahSeries = await prisma.series.upsert({
        where: { id: 'series-tazkiyah-1' },
        update: {},
        create: {
            id: 'series-tazkiyah-1',
            title: 'Heart Softeners: Tazkiyah',
            description: 'Purifying the soul in a materialistic world through ancient wisdom and modern application.',
            thumbnailUrl: '/assets/images/mock/tazkiyah.png',
            episodeCount: 8,
            category: 'Spirituality',
            scholarId: seededScholars[4].id, // Sheikh Ibrahim Musa (Theology)
        }
    });

    // 3. Live Sessions
    const liveSessionsData = [
        {
            id: 'live-fiqh-1',
            title: 'Principles of Zakat in Modern Finance',
            description: 'Understanding how to calculate Zakat on stocks, crypto, and business assets.',
            thumbnailUrl: '/assets/images/mock/fiqh.png',
            viewCount: 1200,
            type: 'VIDEO',
            scholarId: seededScholars[0].id, // Dr. Ahmed Al-Falahi
            createdAt: new Date(Date.now() - 24 * 60000), // 24m ago
        },
        {
            id: 'live-spirituality-1',
            title: 'The Art of Gratitude (Shukr)',
            description: 'Finding inner peace through the continuous remembrance of Allah’s blessings.',
            thumbnailUrl: '/assets/images/mock/spirituality.png',
            viewCount: 842,
            type: 'VIDEO',
            scholarId: seededScholars[1].id, // Sheikh Yusuf Rahman
            createdAt: new Date(Date.now() - 10 * 60000), // 10m ago
        },
        {
            id: 'live-audio-1',
            title: 'Open Q&A: Family & Social Issues',
            description: 'Live community session addressing daily challenges and social interactions.',
            thumbnailUrl: null, // Audio only might not have a thumbnail in the card top, or use a placeholder
            viewCount: 2100,
            type: 'AUDIO',
            scholarId: seededScholars[2].id, // Ustadha Amina Zafar
            createdAt: new Date(Date.now() - 45 * 60000), // 45m ago
        }
    ];

    for (const session of liveSessionsData) {
        await prisma.liveSession.upsert({
            where: { id: session.id },
            update: session,
            create: session,
        });
    }

    // 4. Recent (Recorded) Sessions
    const recentSessionsData = [
        {
            id: 'recent-1',
            title: 'Wisdom of Ramadan: Harvesting Spiritual Fruits',
            thumbnailUrl: '/assets/images/mock/recent1.png',
            viewCount: 4500,
            duration: 2535, // 42:15
            type: 'VIDEO',
            scholarId: seededScholars[5].id, // Ustadha Sarah Karim
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
        },
        {
            id: 'recent-2',
            title: 'Hadith of the Day: The Power of Intentions',
            thumbnailUrl: '/assets/images/mock/recent2.png',
            viewCount: 5800,
            duration: 1510, // 25:10
            type: 'AUDIO',
            scholarId: seededScholars[7].id, // Sheikh Khalid Mansour
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60000), // 2 weeks ago
        }
    ];

    for (const session of recentSessionsData) {
        await prisma.liveSession.upsert({
            where: { id: session.id },
            update: session,
            create: session,
        });
    }

    console.log('Series and sessions seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
