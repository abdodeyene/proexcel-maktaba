import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/settings')
export class SettingsController {
  constructor(private service: SettingsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  setMany(@Body() body: Record<string, string>) {
    return this.service.setMany(body);
  }
}
