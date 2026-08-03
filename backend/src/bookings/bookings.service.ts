import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Vehicle, VehicleDocument } from '../vehicles/schemas/vehicle.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel('Vehicle') private vehicleModel: Model<VehicleDocument>,
  ) {}

  // Get all bookings for a specific user
  async getUserBookings(customerId: string): Promise<Booking[]> {
    return await this.bookingModel
      .find({ customerId: new Types.ObjectId(customerId) })
      .populate('vehicleId', 'make model registrationNumber primaryImage ratePerDay')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Check user profile & returning user status
  async getUserBookingProfile(userId: string) {
    const profile = await this.userProfileModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    return {
      isFirstBooking: !profile,
      profile: profile || null,
    };
  }

  // Create or Update Profile + Save Booking
  async createBooking(userId: string, dto: any) {
    const userObjectId = new Types.ObjectId(userId);

    // Validate Vehicle existence & delivery compatibility
    const vehicle = await this.vehicleModel.findById(dto.vehicleId).exec();
    if (!vehicle) {
      throw new NotFoundException('Vehicle listing not found.');
    }

    if (dto.pickupMethod === 'Delivery' && !(vehicle as any).offersDelivery) {
      throw new BadRequestException('This vehicle owner does not offer delivery services.');
    }

    // Validate Driving License expiry date
    const licenseExpiry = new Date(dto.profileData?.drivingLicense?.expiryDate || dto.existingProfileExpiry);
    if (licenseExpiry < new Date()) {
      throw new BadRequestException('Your driving license is expired.');
    }

    // Save or Update User Profile if provided
    if (dto.profileData) {
      await this.userProfileModel.findOneAndUpdate(
        { userId: userObjectId },
        { ...dto.profileData, userId: userObjectId },
        { upsert: true, new: true },
      );
    }

    // Calculate Duration and Amount
    const pDate = new Date(dto.pickupDate);
    const rDate = new Date(dto.returnDate);
    const diffTime = Math.abs(rDate.getTime() - pDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const dailyPrice = vehicle.dailyPrice;
    const deposit = (vehicle as any).securityDeposit || 10000;
    const totalAmount = (dailyPrice * totalDays) + deposit;

    // Create Booking Record
    const newBooking = new this.bookingModel({
      customerId: userObjectId,
      vehicleId: vehicle._id,
      pickupDate: dto.pickupDate,
      pickupTime: dto.pickupTime,
      returnDate: dto.returnDate,
      returnTime: dto.returnTime,
      pickupMethod: dto.pickupMethod,
      deliveryAddress: dto.pickupMethod === 'Delivery' ? dto.deliveryAddress : undefined,
      rentalPurpose: dto.rentalPurpose,
      travelArea: dto.travelArea,
      specialRequests: dto.specialRequests,
      dailyRate: dailyPrice,
      totalDays: totalDays,
      securityDeposit: deposit,
      totalAmount: totalAmount,
      acceptedTermsTimestamp: new Date(),
    });

    return await newBooking.save();
  }
}