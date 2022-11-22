import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth/auth.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const user = {
    id: 4,
    name: 'User 1',
    phone: 9099099009,
    address: '',
    token: '',
    email: 'abcd@example.com',
    password: '12345',
  };

  const userMockService = {};
  const mockerUsersRepository = {
    create: jest.fn().mockImplementation((dto) => {
      const { password, ...rest } = dto;
      console.log(rest);
      return { id: Date.now(), ...rest };
    }),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockerUsersRepository,
        },
        AuthService,
        JwtService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create  a new user and return that', async () => {
    const user = {
      name: 'User 1',
      email: 'user16@gmail.com',
      phone: 8789548789,
      password: 'user16&123',
      address: 'Test address',
    };
    const { password, address, ...rest } = user;
    expect(await service.create(user)).toEqual({
      id: expect.any(Number),
      ...rest,
    });
  });
});
