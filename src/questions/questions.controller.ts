import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get('directed')
  findDirected(@Request() req: any) {
    return this.questionsService.findDirectedTo(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-questions')
  findMyQuestions(@Request() req: any) {
    return this.questionsService.findMyQuestions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/delete')
  deleteQuestion(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.deleteQuestion(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  acceptQuestion(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.acceptQuestion(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/decline')
  declineQuestion(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.declineQuestion(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('urgent/all')
  findUrgent() {
    return this.questionsService.findUrgentQuestions();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  voteQuestion(
    @Param('id') id: string,
    @Body() dto: { value: number },
    @Request() req: any
  ) {
    return this.questionsService.voteQuestion(id, req.user.id, dto.value);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/answers')
  answerQuestion(
    @Param('id') id: string,
    @Body() dto: { content: string },
    @Request() req: any
  ) {
    return this.questionsService.answerQuestion(id, req.user.id, dto.content);
  }
}
