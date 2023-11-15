import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
