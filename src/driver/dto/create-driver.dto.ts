import { IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Vehicle } from 'src/entities/vehicle.entity';

export class CreateDriverDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  drivingLicence: string;

  @IsNotEmpty()
  permitPoints: number;

  vehicles: Vehicle[];
}
