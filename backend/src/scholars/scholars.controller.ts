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

    // ⚠️ All specific string routes MUST come BEFORE :id
    // Otherwise :id catches "stats", "my-answers", etc. as the id parameter

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

    // Parameterized routes MUST come AFTER all specific string routes
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

    // :id MUST be the LAST @Get route to avoid catching specific routes
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.scholarsService.findOne(id);
    }
}
