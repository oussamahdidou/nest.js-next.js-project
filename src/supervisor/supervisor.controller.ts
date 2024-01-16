import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';

@UseGuards(JwtGuard, RolesGuard)
@Controller('supervisor')
export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  @Post('signup')
  create(@Body() createSupervisorDto: CreateSupervisorDto) {
    return this.supervisorService.create(createSupervisorDto);
  }

  @Get()
  findAll() {
    return this.supervisorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supervisorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupervisorDto: UpdateSupervisorDto,
  ) {
    return this.supervisorService.update(id, updateSupervisorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supervisorService.remove(id);
  }

  @Get('products/in-warehouse')
  findProductsInWarehouse(@GetUser('id') user_id: string) {
    return this.supervisorService.findProductsInWarehouse(user_id);
  }

  @Get('packages/in-warehouse')
  findPackagesBySupervisor(@GetUser('id') user_id: string) {
    return this.supervisorService.findPackagesBySupervisor(user_id);
  }
}
