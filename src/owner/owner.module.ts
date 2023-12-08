import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner, User } from 'src/entities';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Owner, User])],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
