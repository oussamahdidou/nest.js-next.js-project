import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CreateAvailableDriverDto } from './dto/create-available-driver.dto';
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('signup')
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(id);
  }

  // functions for the available drivers

  @Post('available')
  mentionAvailability(
    @Body() createAvailableDriverDto: CreateAvailableDriverDto,
  ) {
    return this.driverService.mentionAvailability(createAvailableDriverDto);
  }

  @Get('available/find-all')
  sortAvailableDrivers() {
    return this.driverService.sortAvailableDrivers();
  }
}
