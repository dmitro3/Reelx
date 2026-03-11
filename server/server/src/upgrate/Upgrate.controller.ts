import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { UpgrateService } from './Upgrate.service';
import { GetChanceDto } from './dto/get-chance.dto';
import { JwtAuthGuard } from '../../libs/common/guard/jwt-auth.guard.guard';
import { CurrentUser } from '../../libs/common/decorators/current-user.decorator';

@Controller('upgrate')
export class UpgrateController {
  constructor(private readonly upgrateService: UpgrateService) {}

  @Post('get-chance')
  @UseGuards(JwtAuthGuard)
  async getChance(
    @CurrentUser() userId: string,
    @Body() body: GetChanceDto,
  ) {
    return this.upgrateService.getChance(
      userId,
      body.toyIds,
      body.multiplier,
    );
  }

  @Get('start-game')
  @UseGuards(JwtAuthGuard)
  async startGame(@CurrentUser() userId: string) {
    return this.upgrateService.startGame(userId);
  }
}
