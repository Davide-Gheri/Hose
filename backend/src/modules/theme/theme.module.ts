import { Module } from '@nestjs/common';
import { ThemeService } from './services/theme.service';
import { ThemeController } from './controllers/theme.controller';

@Module({
  providers: [ThemeService],
  controllers: [ThemeController]
})
export class ThemeModule {}
