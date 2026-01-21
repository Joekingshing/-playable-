import { Module } from '@nestjs/common';
import { ConfigModule } from '@backend/config';
import { LoggerModule } from '@backend/logger';
import { DatabaseModule } from '@backend/database';
import { HealthController } from './health.controller';
import { ExportModule } from './modules/export/export.module';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule, ExportModule],
  controllers: [HealthController],
})
export class AppModule {}
