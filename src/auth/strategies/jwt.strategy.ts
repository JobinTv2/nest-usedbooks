import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/utils/type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SCRETE,
    });
  }

  async validateUser(email: string, password: string) {
    console.log('h');
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
