import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  app.enableCors();

  const port = Number(process.env.ADMIN_PORT ?? 8081);
  await app.listen(port);
}

bootstrap();
