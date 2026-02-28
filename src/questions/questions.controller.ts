import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req: any, @Body() dto: CreateQuestionDto) {
        return this.questionsService.create(req.user.id, dto);
    }

    @Get()
    findAll() {
        return this.questionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(id);
    }
}
