"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
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
            role: client_1.Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=11',
        },
        {
            name: 'Sheikh Yusuf Rahman',
            email: 'yusuf.rahman@example.com',
            password: hashedPassword,
            specialization: 'Hadith Studies',
            bio: 'Author of several books on Hadith sciences. Focuses on the authentication of narrations and their practical application in the modern world.',
            isVerified: true,
            role: client_1.Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=12',
        },
        {
            name: 'Ustadha Amina Zafar',
            email: 'amina.zafar@example.com',
            password: hashedPassword,
            specialization: 'Family & Marriage Counseling',
            bio: 'Certified counselor combining psychological principles with Islamic teachings to help families and individuals navigate life’s complex relationships.',
            isVerified: true,
            role: client_1.Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        {
            name: 'Dr. Omar Farooq',
            email: 'omar.farooq@example.com',
            password: hashedPassword,
            specialization: 'Islamic History & Civilization',
            bio: 'Professor of History with a focus on the Golden Age of Islam and its contributions to science and philosophy.',
            isVerified: true,
            role: client_1.Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=33',
        },
        {
            name: 'Sheikh Ibrahim Musa',
            email: 'ibrahim.musa@example.com',
            password: hashedPassword,
            specialization: 'Theology (Aqeedah)',
            bio: 'Graduate of Madinah University. Teaches the fundamentals of Islamic belief and spirituality with an emphasis on personal connection with the Creator.',
            isVerified: true,
            role: client_1.Role.SCHOLAR,
            avatar: 'https://i.pravatar.cc/150?img=68',
        },
        {
            name: 'Ustadha Sarah Karim',
            email: 'sarah.karim@example.com',
            password: hashedPassword,
            specialization: 'Youth & Education',
            bio: 'Dedicated to empowering Muslim youth through education and mentorship programs. Focuses on building a strong identity and positive character.',
            isVerified: true,
            role: client_1.Role.SCHOLAR,
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
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map