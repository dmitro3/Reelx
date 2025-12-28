import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userId = request.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request. Make sure JwtAuthGuard is applied.');
    }

    return userId;
  },
);

