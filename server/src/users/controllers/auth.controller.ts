import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ValidateTelegramInitDataPipe } from '../pipes/validate-telegram-init-data.pipe';
import { UserLoginInterface } from '../interface/user-login.interface';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../../../libs/common/guard/jwt-auth.guard.guard';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(ValidateTelegramInitDataPipe) userData: UserLoginInterface,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(userData);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: any) {
    // TODO: Implement refresh token logic
    return {};
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() userId: string) {
    return this.authService.getProfile(userId);
  }
}

