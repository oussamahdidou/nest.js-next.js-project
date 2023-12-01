import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
// the are many ways to hash the password (bcrypt , argon ...) in here i'm using argon
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleType } from '../enumerations/role.enum';
import { CreateOwnerDto } from '../owner/dto/create-owner.dto';
import { CreateDriverDto } from '../driver/dto/create-driver.dto';
import { User, Owner, Driver } from '../entities';
import { Logger } from '@nestjs/common';
import { Vehicle } from 'src/entities/vehicle.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
    @InjectRepository(Owner) private ownerRepository: Repository<Owner>,
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupUser(dto: CreateUserDto) {
    try {
      // generate the hashed password
      const hash = await argon.hash(dto.password);
      // add the user to the db
      const user = this.usersRepository.create({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        CNI: dto.CNI,
        dateBirth: dto.dateBirth,
        phoneNumber: dto.phoneNumber,
        password: hash,
      });
      // return the saved user
      const newUser = await this.usersRepository.save(user);

      return this.signToken(newUser.id, newUser.email, newUser.role);
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation (e.g., duplicate email)
        throw new ForbiddenException('Credentials incorrect');
      } else {
        // Handle other errors
        this.logger.error(
          `Error during signupUser: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
  async signupOwner(dto: CreateOwnerDto) {
    try {
      // generate the hashed password
      const hash = await argon.hash(dto.password);
      // add the user to the db
      const user = this.ownerRepository.create({
        email: dto.email,
        role: dto.role,
        firstName: dto.firstName,
        lastName: dto.lastName,
        CNI: dto.CNI,
        dateBirth: dto.dateBirth,
        phoneNumber: dto.phoneNumber,
        companyName: dto.companyName,
        companyRegistrationNumber: dto.companyRegistrationNumber,
        password: hash,
      });
      // return the saved user
      const newUser = await this.ownerRepository.save(user);

      return this.signToken(newUser.id, newUser.email, newUser.role);
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation (e.g., duplicate email)
        throw new ForbiddenException('Credentials incorrect');
      } else {
        // Handle other errors
        this.logger.error(
          `Error during signupUser: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
  async signupDriver(dto: CreateDriverDto) {
    try {
      // generate the hashed password
      const hash = await argon.hash(dto.password);
      // add the user to the db
      const user = this.driverRepository.create({
        email: dto.email,
        role: dto.role,
        firstName: dto.firstName,
        lastName: dto.lastName,
        CNI: dto.CNI,
        dateBirth: dto.dateBirth,
        phoneNumber: dto.phoneNumber,
        drivingLicence: dto.drivingLicence,
        permitPoints: dto.permitPoints,
        password: hash,
      });

      // const vehicles = dto.vehicles.map((CreateVehicleDto) =>
      //   this.vehicleRepository.create({
      //     marque: CreateVehicleDto.marque,
      //     model: CreateVehicleDto.model,
      //     registrationNumber: CreateVehicleDto.registrationNumber,
      //     driver: user, // Set the association
      //   }),
      // );

      // // Assign vehicles to the driver
      // user.vehicles = vehicles;

      // return the saved user
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newDriver = await this.driverRepository.save(user);
      const newUser = await this.usersRepository.save(user);

      return this.signToken(newDriver.id, newUser.email, newUser.role);
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation (e.g., duplicate email)
        throw new ForbiddenException('Credentials incorrect');
      } else {
        // Handle other errors
        this.logger.error(
          `Error during signupUser: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async signin(dto: UpdateUserDto) {
    // find the user with the email
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare password

    const passMatches = await argon.verify(user.password, dto.password);

    if (!passMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email, user.role);
  }

  // Generation of the jwt token
  async signToken(
    userId: number,
    email: string,
    role: RoleType,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email, role };
    const secret = this.config.get('JWT_SECRET');

    const jwtoken = await this.jwt.signAsync(payload, {
      expiresIn: '120s',
      secret: secret,
    });

    return {
      access_token: jwtoken,
    };
  }
}
