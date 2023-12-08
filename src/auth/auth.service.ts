import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

// the are many ways to hash the password (bcrypt , argon ...) in here i'm using argon
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleType } from '../enumerations/role.enum';
import { CreateOwnerDto } from '../owner/dto/create-owner.dto';
import { CreateDriverDto } from '../driver/dto/create-driver.dto';
import { User, Owner, Driver, Supervisor } from '../entities';
import { Logger } from '@nestjs/common';
import { CreateSupervisorDto } from 'src/supervisor/dto/create-supervisor.dto';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    // Repositories
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
    @InjectRepository(Owner) private ownerRepository: Repository<Owner>,
    @InjectRepository(Supervisor)
    private supervisorRepository: Repository<Supervisor>,
    // Services
    private readonly warehouseService: WarehouseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupUser(dto: CreateUserDto) {
    try {
      // generate the hashed password
      const hash = await argon.hash(dto.password);
      // add the user to the db
      const user = this.usersRepository.create({
        ...dto,
        id: uuidv4(),
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
        ...dto,
        id: uuidv4(),
        password: hash,
      });
      // return the saved user
      const newUser = await this.usersRepository.save(user);

      const owner = this.ownerRepository.create({
        ...dto,
        id: newUser.id,
        password: hash,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newOwner = await this.ownerRepository.save(owner);

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
      const user = this.usersRepository.create({
        ...dto,
        id: uuidv4(),
        password: hash,
      });

      // return the saved user
      const newUser = await this.usersRepository.save(user);

      const driver = this.driverRepository.create({
        ...dto,
        id: newUser.id,
        password: hash,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newDriver = await this.driverRepository.save(driver);

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

  async signupSupervisor(dto: CreateSupervisorDto) {
    try {
      // generate the hashed password
      const hash = await argon.hash(dto.password);
      // add the user to the db
      const user = this.usersRepository.create({
        ...dto,
        id: uuidv4(),
        password: hash,
      });
      const newUser = await this.usersRepository.save(user);

      const supervisor = this.supervisorRepository.create({
        ...dto,
        id: newUser.id,
        password: hash,
      });
      supervisor.warehouse = await this.warehouseService.findById(
        dto.warehouseId,
      );
      // return the saved user
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newSupervisor = await this.supervisorRepository.save(supervisor);

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
    userId: string,
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
