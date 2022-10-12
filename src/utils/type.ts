export type CreateBookParams = {
  name: string;
  title: string;
  description: string;
  rating: number;
  is_sold: boolean;
  owner_id: number;
  categroy: string;
  reviews: string;
  createdAt: Date;
};

export type User = {
  id: number;
  name: string;
  phone: number;
  password: string;
  email: string;
};
