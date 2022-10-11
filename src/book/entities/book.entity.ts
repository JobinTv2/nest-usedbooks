import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  rating: number;
  @Column()
  is_sold: boolean;
  @Column()
  owner_id: number;
  @Column()
  category: string;
  @Column()
  reviews: string;
  @Column()
  createdAt: Date;
}
