import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositorys/user.repository';
import { ChangeUsernameDto } from '../dto/change-username.dto';

@Injectable()
export class UsersService {
  
    constructor(private readonly userRepository: UserRepository) {}


    async createUser(telegramId:string, username:string, photo_url:string) {
        await this.userRepository.createUser({telegramId, username, photoUrl: photo_url})
    }

    async changeUsername(userId: string, changeUsernameDto: ChangeUsernameDto): Promise<void> {
        await this.userRepository.changeUsername(userId, changeUsernameDto.username);
    }

    async findUserByTelegramId(telegramId:string) {
        return (await this.userRepository.findUserByTelegramId(telegramId))
    }
}

