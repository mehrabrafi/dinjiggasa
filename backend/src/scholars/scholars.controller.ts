import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ScholarsService } from './scholars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scholars')
export class ScholarsController {
    constructor(private readonly scholarsService: ScholarsService) { }

    @Get()
    findAll() {
        return this.scholarsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    getStats(@Request() req: any) {
        return this.scholarsService.getScholarStats(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-answers')
    getMyAnswers(@Request() req: any) {
        return this.scholarsService.getMyAnswers(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('analytics')
    getAnalytics(@Request() req: any) {
        return this.scholarsService.getAnalytics(req.user.id);
    }

    @Get('top')
    getTopScholars() {
        return this.scholarsService.getTopScholars();
    }
}
