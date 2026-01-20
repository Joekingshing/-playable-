import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { resolve } from 'path';

const env = process.env.NODE_ENV ?? 'development';
const rootEnv = resolve(process.cwd(), '..', '.env');
const modeEnv = resolve(process.cwd(), '..', '.env.' + env);

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [rootEnv, modeEnv],
    }),
  ],
})
export class ConfigModule {}
