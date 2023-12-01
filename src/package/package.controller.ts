
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto,UpdatePackageDto} from './dto/create-update-package.dto';
import { GetPackage } from './decorator/get-package.decorator';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @Get('info')
  findOne(@GetPackage('id') packageId: number) {
    console.log({packageId});
    return this.packageService.findOne(packageId);
  }

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Put(':id')
  update(@Param('id') id:string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update( +id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }
}
