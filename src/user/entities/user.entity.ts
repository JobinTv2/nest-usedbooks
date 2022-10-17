import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  name: string;
  @Column({ nullable: false })
  phone: number;
  @Column({ nullable: false })
  password: string;
  @Column({ unique: true, nullable: false })
  email: string;
}
