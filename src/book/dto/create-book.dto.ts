export class CreateBookDto {
  name: string;
  title: string;
  description: string;
  rating: number;
  is_sold: boolean;
  owner_id: number;
  categroy: string;
  reviews: string;
  createdAt: Date;
  author: string;
  price: number;
}
