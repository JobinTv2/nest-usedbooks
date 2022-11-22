import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const users = [
    {
      id: 4,
      name: 'User 1',
      phone: 9099099009,
      address: null,
      token: '',
      email: 'abcd@example.com',
      password: '12345',
    },
  ];
  const userMockService = {
    create: jest.fn((dto) => {
      const { password, ...rest } = dto;
      return {
        id: Date.now(),
        ...rest,
      };
    }),
    login: jest.fn((dto) => {
      const { email, password } = dto;
      const result = users.find(
        (user) => user.email === email && user.password === password,
      );
      const { password: pswrd, ...rest } = result;
      return {
        ...rest,
        email,
      };
    }),
    findAll: jest.fn(() => {
      return users;
    }),
    findOne: jest.fn((id) => {
      const user = users.find((usr) => usr.id === id);
      const { password, token, ...rest } = user;
      return rest;
    }),
    update: jest.fn((id, dto) => {
      const result = users.map((user) => {
        if (user.id === id) {
          return Object.assign({}, user, dto);
        }
        return user;
      });
      const { password, token, ...rest } = result[0];
      return { id, ...rest };
    }),
    remove: jest.fn((id) => {
      return users.filter((user) => user.id !== id);
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, AuthService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue(userMockService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    expect(
      controller.create({
        name: 'Test user',
        phone: 808989898,
        email: 'test@example.com',
        address: 'Test address',
        password: 'password123',
      }),
    ).toEqual({
      id: expect.any(Number),
      name: 'Test user',
      phone: 808989898,
      email: 'test@example.com',
      address: 'Test address',
    });
  });

  it('should login if email and password is correct', () => {
    expect(
      controller.login({
        email: 'abcd@example.com',
        password: '12345',
      }),
    ).toEqual({
      id: expect.any(Number),
      name: 'User 1',
      phone: 9099099009,
      email: 'abcd@example.com',
      address: null,
      token: expect.any(String),
    });
  });

  it('should find a user', () => {
    expect(controller.findOne('4')).toEqual({
      id: expect.any(Number),
      name: 'User 1',
      phone: 9099099009,
      email: 'abcd@example.com',
      address: null,
    });
  });

  it('should update user', () => {
    const dto = { name: 'Update' };
    expect(controller.update('4', dto)).toEqual({
      id: expect.any(Number),
      name: 'Update',
      phone: 9099099009,
      email: 'abcd@example.com',
      address: null,
    });
  });

  it('should delete user', () => {
    expect(controller.remove('4')).toEqual([]);
  });
});
