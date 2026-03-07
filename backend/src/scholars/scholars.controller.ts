import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { ScholarsService } from './scholars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scholars')
export class ScholarsController {
    constructor(private readonly scholarsService: ScholarsService) { }

    @Get()
    findAll() {
        return this.scholarsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.scholarsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    getStats(@Request() req: any) {
        return this.scholarsService.getScholarStats(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('sidebar-counts')
    getSidebarCounts(@Request() req: any) {
        return this.scholarsService.getSidebarCounts(req.user.id);
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

    @Get(':id/stats')
    getScholarStats(@Param('id') id: string) {
        return this.scholarsService.getScholarStats(id);
    }

    @Get(':id/answers')
    getScholarAnswers(@Param('id') id: string) {
        return this.scholarsService.getMyAnswers(id);
    }

    @Get(':id/similar')
    getSimilarScholars(@Param('id') id: string) {
        return this.scholarsService.getSimilarScholars(id);
    }
}
