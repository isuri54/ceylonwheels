import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { join } from 'path';

async function bootstrap() {
  // Create the NestJS application instance using the root AppModule
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Fetch configurations
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Global Prefix - groups all endpoints under api/v1 (e.g., http://localhost:3000/api/v1/auth)
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  // This allows frontend to send requests to this API
  app.enableCors({
    origin: true, // allows dynamic incoming request headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe
  // Automatically validates incoming request payloads (DTOs) and strips out unauthorized malicious data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that do not have explicit decorators in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown data properties are submitted
      transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
    }),
  );

  // Check MongoDB Connection Status before finalizing app startup
  try {
    const mongooseConnection = app.get<Connection>(getConnectionToken());
    // If the database is already connected or currently connecting
    if (mongooseConnection.readyState === 1) {
      console.log('MongoDB Connected successfully');
    } else {
      // Listen for the open event if it's still finishing the handshake
      mongooseConnection.once('open', () => {
        console.log('MongoDB Connected successfully');
      });
    }
  } catch (error) {
    console.log('Could not verify database status at startup.');
  }

  // Serve everything inside root uploads folder publicly over http://localhost:3000/uploads/...
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(port);
  console.log(`CeylonWheels backend is running on: http://localhost:${port}/api/v1`);
}

bootstrap();