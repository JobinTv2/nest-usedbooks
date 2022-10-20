export class CreateUserDto {
  id: number;
  name: string;
  phone: number;
  password: string;
  email: string;
  address?: string;
}
