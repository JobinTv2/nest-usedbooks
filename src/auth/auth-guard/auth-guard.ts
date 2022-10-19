import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException('Token Not Present');
    }

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      let result;
      try {
        result = this.authService.verifyToken(token);
      } catch (err) {
        throw new UnauthorizedException('Invalid Authorization');
      }
      if (result === undefined) {
        throw new UnauthorizedException('Invalid Authorization');
      } else {
        return true;
      }
    } else {
      throw new UnauthorizedException('Invalid Authorization');
    }
  }
}
