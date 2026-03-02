import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
export declare class QuestionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateQuestionDto): Promise<{
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        directedScholars: {
            id: string;
            name: string;
            avatar: string | null;
        }[];
        tags: {
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    }>;
    findAll(): Promise<({
        answers: ({
            author: {
                name: string;
                avatar: string | null;
                specialization: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            content: string;
            isAccepted: boolean;
            questionId: string;
        })[];
        ratings: {
            userId: string;
            value: number;
        }[];
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        tags: {
            id: string;
            name: string;
        }[];
        _count: {
            answers: number;
            ratings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    })[]>;
    findOne(id: string): Promise<{
        answers: ({
            author: {
                id: string;
                name: string;
                avatar: string | null;
                role: import(".prisma/client").$Enums.Role;
                reputation: number;
            };
            _count: {
                ratings: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            content: string;
            isAccepted: boolean;
            questionId: string;
        })[];
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            reputation: number;
        };
        tags: {
            id: string;
            name: string;
        }[];
        _count: {
            ratings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    }>;
    findDirectedTo(scholarId: string): Promise<({
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        tags: {
            id: string;
            name: string;
        }[];
        _count: {
            answers: number;
            ratings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    })[]>;
    findMyQuestions(authorId: string): Promise<({
        answers: ({
            author: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            content: string;
            isAccepted: boolean;
            questionId: string;
        })[];
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        tags: {
            id: string;
            name: string;
        }[];
        _count: {
            answers: number;
            ratings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    })[]>;
    findUrgentQuestions(): Promise<({
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        tags: {
            id: string;
            name: string;
        }[];
        _count: {
            answers: number;
            ratings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    })[]>;
    deleteQuestion(id: string, authorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    }>;
    acceptQuestion(id: string, scholarId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    }>;
    declineQuestion(id: string, scholarId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
        isUrgent: boolean;
        acceptedById: string | null;
    }>;
    answerQuestion(questionId: string, scholarId: string, content: string): Promise<{
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        content: string;
        isAccepted: boolean;
        questionId: string;
    }>;
    voteQuestion(questionId: string, userId: string, value: number): Promise<{
        userId: string;
        value: number;
    }[]>;
}
