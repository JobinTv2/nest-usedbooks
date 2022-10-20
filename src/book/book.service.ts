import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}
  create(createBookDto: CreateBookDto) {
    const newBook = this.bookRepository.create({
      ...createBookDto,
      createdAt: new Date(),
      rating: 2.0,
    });
    return this.bookRepository.save(newBook);
  }

  findAll() {
    return this.bookRepository.find();
  }

  findOne(id: number) {
    return this.bookRepository.findBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    if (updateBookDto.rating > 5) {
      updateBookDto.rating = 5;
    }
    await this.bookRepository.update({ id }, { ...updateBookDto });
    const bookDetails = this.bookRepository.findOneBy({ id });
    return bookDetails;
  }

  remove(id: number) {
    return this.bookRepository.delete({ id });
  }
}
