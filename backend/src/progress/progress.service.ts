import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async saveQuizScore(userId: string, moduleId: string, score: number) {
    // Check if progress already exists
    const existing = await this.prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId
        }
      }
    });

    if (existing) {
      // Update existing progress by adding XP and updating score
      return this.prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          quizScore: Math.max(existing.quizScore || 0, score),
          xpEarned: (existing.xpEarned || 0) + score
        }
      });
    }

    // Create new progress record
    return this.prisma.userProgress.create({
      data: {
        userId,
        moduleId,
        quizScore: score,
        xpEarned: score,
        labCompleted: false
      }
    });
  }
}
