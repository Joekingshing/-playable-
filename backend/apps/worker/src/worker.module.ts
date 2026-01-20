import { Module } from '@nestjs/common';
import { ConfigModule } from '@backend/config';
import { LoggerModule } from '@backend/logger';
import { DatabaseModule } from '@backend/database';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule],
})
export class WorkerModule {}
