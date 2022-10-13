import { Injectable } from '@nestjs/common';
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
        return this.userRepository.save(newUser).then((user: User) => {
          const { password, ...rest } = user;
          return rest;
        });
      });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  login(loginUserDto: LoginUserDto) {
    return this.validateUser(loginUserDto.email, loginUserDto.password).then(
      (user: User): string | PromiseLike<string> | { error: string } => {
        if (user) {
          return this.authService.generateJWT(user);
        }
        return { error: 'Invalid credentials' };
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
