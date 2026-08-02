import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { UserProfile, UserProfileSchema } from './schemas/user-profile.schema';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}