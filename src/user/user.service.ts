import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private authService: AuthService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.authService
      .hashPassword(createUserDto.password)
      .then((hashPassword) => {
        const newUser = new User();
        newUser.name = createUserDto.name;
        newUser.email = createUserDto.email;
        newUser.phone = createUserDto.phone;
        newUser.password = hashPassword;
        return this.userRepository
          .save(newUser)
          .then((user: User) => {
            const { password, ...rest } = user;
            return rest;
          })
          .catch((err) => {
            return { error: err };
          });
      })
      .catch((err) => {
        return { error: 'Password is not present' };
      });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({ id }, updateUserDto);
    const updatedUser: User = await this.userRepository.findOneBy({ id });

    const user = {
      id: updatedUser?.id,
      name: updatedUser?.name,
      email: updatedUser?.email,
      phone: updatedUser?.phone,
      address: updatedUser?.address,
    };
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  login(loginUserDto: LoginUserDto) {
    return this.validateUser(loginUserDto.email, loginUserDto.password).then(
      async (
        user: User,
      ): Promise<
        | PromiseLike<string>
        | { error: string; statusCode: number }
        | { token: string; email: string }
      > => {
        if (user) {
          const result = await this.authService
            .generateJWT(user)
            .then((response) => {
              return response;
            });
          const { password, ...rest } = await this.findByMail(
            loginUserDto.email,
          );
          return {
            ...rest,
            token: result,
          };
        }
        throw new UnauthorizedException('Invalid');
      },
    );
  }

  validateUser(email: string, password: string) {
    return this.findByMail(email)
      .then((user: User) => {
        if (!user) return null;
        return this.authService
          .comparePasswords(password, user.password)
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

  findByMail(email: string): Promise<any> {
    return this.userRepository.findOneBy({ email });
  }
}
