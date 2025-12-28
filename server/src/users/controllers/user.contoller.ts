import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ChangeUsernameDto } from '../dto/change-username.dto';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../../libs/common/guard/jwt-auth.guard.guard';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UsersService) {}

    @Put('/change-username')
    @UseGuards(JwtAuthGuard)
    async changeUsername(
      @CurrentUser() userId: string,
      @Body() changeUsernameDto: ChangeUsernameDto,
    ) {
      return this.userService.changeUsername(userId, changeUsernameDto);
    }


}

