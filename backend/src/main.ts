import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  // Ensure upload directories exist
  for (const dir of ['products', 'logo', 'sliders', 'categories']) {
    mkdirSync(join(process.cwd(), 'uploads', dir), { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: (origin, callback) => {
      // Autoriser file:// (origin = undefined ou string "null") et tout localhost
      if (!origin || origin === 'null') return callback(null, true);
      if (
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS non autorisé: ${origin}`));
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`ProExcel backend running on http://localhost:${port}`);
}

bootstrap();
