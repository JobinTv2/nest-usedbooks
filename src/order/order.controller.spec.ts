import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth/auth.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  const orders = [
    {
      id: 1,
      transaction_id: '1000',
      user_id: 1,
      book_id: 10,
      address: 'address',
    },
  ];
  const orderMockService = {
    create: jest.fn((dto) => {
      return { id: Date.now(), ...dto };
    }),
    update: jest.fn((id, dto) => {
      const order = orders.find((ordr) => ordr.id === id);
      return { ...order, ...dto };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService, AuthService, JwtService],
    })
      .overrideProvider(OrderService)
      .useValue(orderMockService)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create order', () => {
    expect(
      controller.create({
        transaction_id: '1000',
        user_id: 1,
        book_id: 10,
        address: 'address',
      }),
    ).toEqual({
      transaction_id: '1000',
      user_id: 1,
      book_id: 10,
      address: 'address',
      id: expect.any(Number),
    });
  });

  it('should update order', () => {
    expect(controller.update('1', {})).toEqual(orders[0]);
  });
});
