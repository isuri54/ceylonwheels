import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    VehiclesModule,
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  // Inject the Mongoose connection instance into the module constructor
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    // Listen for the 'open' event which signals a successful connection to MongoDB Atlas
    this.connection.once('open', () => {
      console.log('MongoDB connected successfully');
    });
  }
}