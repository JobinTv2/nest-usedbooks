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
    console.log(process.env.JWT_SCRETE);
    return this.validateUser(loginUserDto.email, loginUserDto.password).then(
      (user: User) => {
        if (user) {
          return this.authService.generateJWT(user);
        }
        return 'Invalid credentials';
      },
    );
  }

  validateUser(email: string, password: string): Promise<any> {
    return this.findByMail(email).then((user: User) => {
      return this.authService
        .comparePasswords(password, user[0].password)
        .then((match: boolean) => {
          if (match) {
            const { password, ...rest } = user;
            return user;
          } else {
            throw Error;
          }
        });
    });
  }

  findByMail(email: string): Promise<any> {
    return this.userRepository.findBy({ email });
  }
}
