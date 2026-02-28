import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(req: any, dto: CreateQuestionDto): Promise<{
        tags: {
            id: string;
            name: string;
        }[];
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
        title: string;
        body: string;
        views: number;
        authorId: string;
    }>;
    findAll(): Promise<({
        _count: {
            answers: number;
            ratings: number;
        };
        tags: {
            id: string;
            name: string;
        }[];
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
        title: string;
        body: string;
        views: number;
        authorId: string;
    })[]>;
    findOne(id: string): Promise<{
        answers: ({
            _count: {
                ratings: number;
            };
            author: {
                id: string;
                name: string;
                avatar: string | null;
                role: import(".prisma/client").$Enums.Role;
                reputation: number;
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
        _count: {
            ratings: number;
        };
        tags: {
            id: string;
            name: string;
        }[];
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            reputation: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        views: number;
        authorId: string;
    }>;
}
