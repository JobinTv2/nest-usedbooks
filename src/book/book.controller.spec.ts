import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth/auth.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BooksController', () => {
  let controller: BookController;
  const books = [
    {
      id: 1,
      name: 'Book 1',
      title: 'Book 1',
      description: 'Description of book 1',
      rating: 1,
      is_sold: false,
      owner_id: 6,
      category: 'Romantic',
      reviews: '',
      createdAt: '2022-10-28T12:24:30.021Z',
      author: 'Author of book ',
      price: 120,
    },
  ];
  const bookMockService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        rating: 2,
        createdAt: '',
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => {
      const order = books.find((ordr) => ordr.id === id);
      return { ...order, ...dto };
    }),
    findOne: jest.fn((id) => {
      const book = books.filter((bk) => bk.id === id);
      return book;
    }),
    findAll: jest.fn(() => {
      return books;
    }),
    remove: jest.fn((id) => {
      return books.find((book) => book.id === id);
    }),
  };

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

  it('should create book', () => {
    expect(
      controller.create({
        name: 'Book 2',
        title: 'Book 2',
        description: 'Description',
        rating: 2,
        is_sold: false,
        owner_id: 1,
        categroy: 'Romantic',
        author: 'Author 2',
        price: 130,
        reviews: 'reviews',
      }),
    ).toEqual({
      name: 'Book 2',
      title: 'Book 2',
      description: 'Description',
      rating: 2,
      is_sold: false,
      owner_id: 1,
      reviews: 'reviews',
      createdAt: expect.any(String),
      author: 'Author 2',
      price: 130,
      categroy: 'Romantic',
      id: expect.any(Number),
    });
  });

  it('should find a book', () => {
    expect(controller.findOne('1')).toEqual([
      {
        id: 1,
        name: 'Book 1',
        title: 'Book 1',
        description: 'Description of book 1',
        rating: 1,
        is_sold: false,
        owner_id: 6,
        category: 'Romantic',
        reviews: '',
        createdAt: '2022-10-28T12:24:30.021Z',
        author: 'Author of book ',
        price: 120,
      },
    ]);
  });

  it('should retun all books', () => {
    expect(controller.findAll()).toEqual([
      {
        id: 1,
        name: 'Book 1',
        title: 'Book 1',
        description: 'Description of book 1',
        rating: 1,
        is_sold: false,
        owner_id: 6,
        category: 'Romantic',
        reviews: '',
        createdAt: '2022-10-28T12:24:30.021Z',
        author: 'Author of book ',
        price: 120,
      },
    ]);
  });

  it('should update a book', () => {
    expect(controller.update('1', { name: 'Book 3' })).toEqual({
      id: 1,
      name: 'Book 3',
      title: 'Book 1',
      description: 'Description of book 1',
      rating: 1,
      is_sold: false,
      owner_id: 6,
      category: 'Romantic',
      reviews: '',
      createdAt: '2022-10-28T12:24:30.021Z',
      author: 'Author of book ',
      price: 120,
    });
  });

  it('should remove a book', () => {
    expect(controller.remove('1')).toEqual({
      id: 1,
      name: 'Book 1',
      title: 'Book 1',
      description: 'Description of book 1',
      rating: 1,
      is_sold: false,
      owner_id: 6,
      category: 'Romantic',
      reviews: '',
      createdAt: '2022-10-28T12:24:30.021Z',
      author: 'Author of book ',
      price: 120,
    });
  });
});
