import { Controller, Post, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';

class SaveQuizDto {
  userId: string;
  moduleId: string;
  score: number;
}

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('quiz')
  async saveQuizScore(@Body() dto: SaveQuizDto) {
    return this.progressService.saveQuizScore(dto.userId, dto.moduleId, dto.score);
  }
}
