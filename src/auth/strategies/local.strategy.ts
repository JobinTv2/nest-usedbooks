import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/utils/type';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  validateUser(email: string, password: string) {
    return this.userService
      .findByMail(email)
      .then((user: User) => {
        if (!user) return null;
        return this.comparePasswords(password, user.password)
          .then((match: boolean) => {
            if (match) {
              return user;
            }
            return false;
          })
          .catch((err) => err);
      })
      .catch((err) => err);
  }
}
