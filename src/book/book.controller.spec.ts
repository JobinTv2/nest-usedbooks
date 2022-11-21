import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth/auth.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BooksController', () => {
  let controller: BookController;
  const bookMockService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService, AuthService, JwtService],
    })
      .overrideProvider(BookService)
      .useValue(bookMockService)
      .compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
