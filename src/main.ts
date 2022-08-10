import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.API_LOGGER === 'DEBUG'
        ? ['log', 'error', 'warn', 'debug', 'verbose']
        : ['log', 'error', 'warn'],
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
