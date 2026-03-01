import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(req: any, dto: CreateQuestionDto): Promise<{
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
    findDirected(req: any): Promise<({
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
    findMyQuestions(req: any): Promise<({
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
    deleteQuestion(id: string, req: any): Promise<{
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
    acceptQuestion(id: string, req: any): Promise<{
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
    declineQuestion(id: string, req: any): Promise<{
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
    findUrgent(): Promise<({
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
    voteQuestion(id: string, dto: {
        value: number;
    }, req: any): Promise<{
        userId: string;
        value: number;
    }[]>;
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
    answerQuestion(id: string, dto: {
        content: string;
    }, req: any): Promise<{
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
}
