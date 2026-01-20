import { Module } from '@nestjs/common';
import { ConfigModule } from '@backend/config';
import { LoggerModule } from '@backend/logger';
import { DatabaseModule } from '@backend/database';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule],
  controllers: [HealthController],
})
export class AdminModule {}
