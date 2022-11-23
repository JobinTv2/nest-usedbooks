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
  let users = [
    {
      id: 4,
      name: 'User 1',
      phone: 9099099009,
      address: '',
      token: '',
      email: 'abcd@example.com',
      password: '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
    },
  ];

  const mockerUsersRepository = {
    create: jest.fn().mockImplementation((dto) => {
      const { password, ...rest } = dto;
      return { id: Date.now(), ...rest };
    }),
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    update: jest.fn().mockImplementation((id, dto) => {
      const result = users.map((item) => {
        if (item.id === id.id) {
          return Object.assign({}, item, dto);
        }
        return item;
      });
      users = result;
      return Promise.resolve({ ...user, ...dto });
    }),
    findOne: jest.fn().mockImplementation((id) => {
      const user = users.find((usr) => usr.id === id);
      return Promise.resolve({ ...user });
    }),
    findOneBy: jest.fn().mockImplementation((dto) => {
      const user = users.find(
        (usr) => usr.id === dto.id || usr.email == dto.email,
      );
      return Promise.resolve({ ...user });
    }),
    findByMail: jest.fn().mockImplementation((email) => {
      const user = users.find((usr) => usr.email === email);
      return Promise.resolve({ ...user });
    }),
    validateUser: jest.fn().mockImplementation((email, password) => {
      return Promise.resolve({ email, password });
    }),
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

  it('should create a new user and return that', async () => {
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

  it('should update a user', async () => {
    expect(await service.update(4, { name: 'User 1 updated' })).toEqual({
      id: 4,
      name: 'User 1 updated',
      email: 'abcd@example.com',
      phone: 9099099009,
      address: '',
    });
  });

  it('should return a user', async () => {
    expect(await service.findOne(4)).toEqual({
      id: 4,
      name: 'User 1 updated',
      email: 'abcd@example.com',
      phone: 9099099009,
      address: '',
      token: '',
    });
  });

  it('should return a user with the given mail id', async () => {
    expect(await service.findByMail('abcd@example.com')).toEqual({
      id: 4,
      name: 'User 1 updated',
      phone: 9099099009,
      address: '',
      token: '',
      email: 'abcd@example.com',
      password: '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
    });
  });

  it('should return user if email and password is correct', async () => {
    expect(await service.validateUser('abcd@example.com', 'user1&123')).toEqual(
      {
        id: 4,
        name: 'User 1 updated',
        phone: 9099099009,
        address: '',
        token: '',
        email: 'abcd@example.com',
        password:
          '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
      },
    );
  });

  it('should return false if wrong email is passed', async () => {
    expect(
      await service.validateUser('falsemail@example.com', '12345'),
    ).toEqual(false);
  });

  it('should return false if wrong password is passed', async () => {
    expect(
      await service.validateUser('abcd@example.com', 'incorrectpassword'),
    ).toEqual(false);
  });
});
