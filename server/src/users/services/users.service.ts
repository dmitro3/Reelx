import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositorys/user.repository';
import { ChangeUsernameDto } from '../dto/change-username.dto';

@Injectable()
export class UsersService {
  
    constructor(private readonly userRepository: UserRepository) {}

    async changeUsername(userId: string, changeUsernameDto: ChangeUsernameDto): Promise<void> {
        await this.userRepository.changeUsername(userId, changeUsernameDto.username);
    }
}

