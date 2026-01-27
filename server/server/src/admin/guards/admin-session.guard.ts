import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionId = this.extractSessionId(request);

    if (!sessionId) {
      throw new UnauthorizedException('Session ID not provided');
    }

    const isValid = await this.adminAuthService.validateSession(sessionId);

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Добавляем sessionId в request для использования в контроллерах
    (request as any).sessionId = sessionId;

    return true;
  }

  private extractSessionId(request: Request): string | undefined {
    // Проверяем заголовок x-session-id
    const headerSessionId = request.headers['x-session-id'] as string;
    if (headerSessionId) {
      return headerSessionId;
    }

    // Проверяем cookie (если используется)
    const cookieSessionId = request.cookies?.['sessionId'];
    if (cookieSessionId) {
      return cookieSessionId;
    }

    return undefined;
  }
}
