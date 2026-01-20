import { Module } from '@nestjs/common';
import { ConfigModule } from '@backend/config';
import { LoggerModule } from '@backend/logger';
import { DatabaseModule } from '@backend/database';
import { HealthController } from './health.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule, UsersModule],
  controllers: [HealthController],
})
export class AppModule {}
