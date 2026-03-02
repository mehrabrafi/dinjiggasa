import { ScholarsService } from './scholars.service';
export declare class ScholarsController {
    private readonly scholarsService;
    constructor(scholarsService: ScholarsService);
    findAll(): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        reputation: number;
        specialization: string | null;
        bio: string | null;
        isVerified: boolean;
    }[]>;
}
