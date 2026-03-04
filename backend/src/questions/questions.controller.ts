import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateQuestionDto) {
    return this.questionsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Query('tag') tag?: string) {
    return this.questionsService.findAll({ tag });
  }

  @UseGuards(JwtAuthGuard)
  @Get('directed')
  findDirected(@Request() req: any) {
    return this.questionsService.findDirectedTo(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-questions')
  findMyQuestions(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
  ) {
    return this.questionsService.findMyQuestions(req.user.id, {
      status,
      sort,
      search,
      page: page ? parseInt(page) : 1
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteQuestion(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.deleteQuestion(id, req.user.id, req.user.role);
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
  @Get('saved/all')
  findSavedQuestions(@Request() req: any) {
    return this.questionsService.findSavedQuestions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved/unsave-all')
  unsaveAll(@Request() req: any) {
    return this.questionsService.unsaveAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('draft/all')
  findDraftQuestions(@Request() req: any) {
    return this.questionsService.findDraftQuestions(req.user.id);
  }

  @Get('tags/all')
  findAllTags() {
    return this.questionsService.findAllTags();
  }

  @Get('tags/trending')
  getTrendingTopics() {
    return this.questionsService.getTrendingTopicsWithCounts();
  }

  @Get('stats/global')
  getGlobalStats() {
    return this.questionsService.getGlobalStats();
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.questionsService.search(q);
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/save')
  toggleSaveQuestion(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.toggleSaveQuestion(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/is-saved')
  checkSaved(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.checkSaved(id, req.user.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    const ip = req.ip;
    return this.questionsService.findOne(id, userId, ip);
  }

  @UseGuards(JwtAuthGuard)
  @Post('answers/:id/vote')
  voteAnswer(
    @Param('id') id: string,
    @Body() dto: { value: number },
    @Request() req: any
  ) {
    return this.questionsService.voteAnswer(id, req.user.id, dto.value);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/answers')
  answerQuestion(
    @Param('id') id: string,
    @Body() dto: { content: string, categories: string[], voiceUrl?: string },
    @Request() req: any
  ) {
    return this.questionsService.answerQuestion(id, req.user.id, dto.content, dto.categories, dto.voiceUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/draft')
  saveDraft(
    @Param('id') id: string,
    @Body() dto: { content: string, voiceUrl?: string },
    @Request() req: any
  ) {
    return this.questionsService.saveDraft(id, req.user.id, dto.content, dto.voiceUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/draft')
  getDraft(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.getDraft(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('answers/:id')
  deleteAnswer(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.deleteAnswer(id, req.user.id, req.user.role);
  }
}
