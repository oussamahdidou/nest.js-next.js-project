import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PackageService } from './package.service';
import {
  CreatePackageDto,
  UpdatePackageDto,
} from './dto/create-update-package.dto';
import { GetPackage } from './decorator/get-package.decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @Get('info')
  findOne(@GetPackage('id') packageId: number) {
    console.log({ packageId });
    return this.packageService.findOne(packageId);
  }

  @Post()
  create(
    @GetUser('id') user_id: string,
    @Body() createPackageDto: CreatePackageDto,
  ) {
    return this.packageService.create(user_id, createPackageDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(+id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }
}
