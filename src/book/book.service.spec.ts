import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';

describe('BooksService', () => {
  let service: BookService;
  const bookMockService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService],
    })
      .overrideProvider(BookService)
      .useValue(bookMockService)
      .compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
