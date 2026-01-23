import { Module } from '@nestjs/common';
import { ConfigModule } from '@backend/config';
import { LoggerModule } from '@backend/logger';
import { DatabaseModule } from '@backend/database';
import { HealthController } from './health.controller';
import { ExportModule } from './modules/export/export.module';
import { AssetsModule } from './modules/assets/assets.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
    ExportModule,
    AssetsModule,
    UploadModule,
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
