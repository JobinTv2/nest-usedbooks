import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // url: process.env.DATABSE_URL,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,

      // host: 'localhost',
      // port: 5432,
      // username: 'postgres',
      // password: 'postgres',
      // database: 'usedBooksDB',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts, .js}'],
      autoLoadEntities: true,
    }),
    BookModule,
    AuthModule,
    UserModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
