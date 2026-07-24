import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { SavedVehicle, SavedVehicleSchema } from './schemas/saved-vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: SavedVehicle.name, schema: SavedVehicleSchema }
    ]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}