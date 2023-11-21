import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionsGuard } from './authorisation/permissions/permissions.guard';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['read', 'execute'])
  getHello(): string {
    return this.appService.getHello();
  }
}
