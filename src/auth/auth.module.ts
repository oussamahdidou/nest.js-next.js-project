import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { Driver, Owner, User } from '../entities';
import { Vehicle } from 'src/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Driver, Owner, Vehicle]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
