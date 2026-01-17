import { Controller, Post, Body } from '@nestjs/common';
import { GiftsService } from './gifts.service';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Post('by-price')
  async getGiftsByPrice(@Body() body?: { amount?: number }) {
    return this.giftsService.getGiftsByPrice(body);
  }
}
