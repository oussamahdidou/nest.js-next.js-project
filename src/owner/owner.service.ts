import { Injectable } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OwnerService {
  constructor(private authService: AuthService) {}

  create(createOwnerDto: CreateOwnerDto) {
    return this.authService.signupOwner(createOwnerDto);
  }

  findAll() {
    return `This action returns all owner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} owner`;
  }

  update(id: number, updateOwnerDto: UpdateOwnerDto) {
    return `This action updates a #${id} owner`;
  }

  remove(id: number) {
    return `This action removes a #${id} owner`;
  }
}
