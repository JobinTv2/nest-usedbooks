import { Module, forwardRef } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService, JwtService],
})
export class BookModule {}
