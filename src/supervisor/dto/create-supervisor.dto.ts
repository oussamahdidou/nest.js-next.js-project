import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateSupervisorDto extends CreateUserDto {
  @IsNotEmpty()
  warehouseId: number;
}
