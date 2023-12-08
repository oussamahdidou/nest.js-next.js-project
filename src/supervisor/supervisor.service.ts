import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supervisor } from 'src/entities/supervisor.entity';
import { Repository } from 'typeorm';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { User } from 'src/entities';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(Supervisor)
    private supervisorRepository: Repository<Supervisor>,
    private warehouseService: WarehouseService,
    private authService: AuthService,
  ) {}

  async create(dto: CreateSupervisorDto) {
    return await this.authService.signupSupervisor(dto);
  }

  findAll(): Promise<Supervisor[]> {
    return this.supervisorRepository.find();
  }

  async findOne(id: string): Promise<Supervisor> {
    const supervisor = await this.supervisorRepository.findOneBy({ id });
    if (!supervisor) {
      throw new NotFoundException(`Supervisor with id ${id} not found`);
    }
    return supervisor;
  }

  async update(
    id: string,
    updateSupervisorDto: UpdateSupervisorDto,
  ): Promise<Supervisor> {
    const supervisor = await this.findOne(id);
    this.supervisorRepository.merge(supervisor, updateSupervisorDto);
    return this.supervisorRepository.save(supervisor);
  }

  async remove(id: string): Promise<void> {
    const supervisor = await this.findOne(id);
    await this.supervisorRepository.remove(supervisor);
  }
}
