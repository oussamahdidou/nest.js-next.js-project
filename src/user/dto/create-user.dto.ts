import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RoleType } from 'src/enumerations/role.enum';

export class CreateUserDto {
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  role: RoleType;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  CNI: string;

  dateBirth: Date;

  @IsNumber()
  phoneNumber: number;
}
