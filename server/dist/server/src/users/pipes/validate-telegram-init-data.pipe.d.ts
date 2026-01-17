import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { UserLoginInterface } from '../interface/user-login.interface';
export declare class ValidateTelegramInitDataPipe implements PipeTransform<string, UserLoginInterface> {
    transform(value: any, metadata: ArgumentMetadata): UserLoginInterface;
}
