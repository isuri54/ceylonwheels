import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { SavedVehicle, SavedVehicleDocument } from './schemas/saved-vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(SavedVehicle.name) private readonly savedVehicleModel: Model<SavedVehicleDocument>
  ) {}

  // SEARCH LOGIC CORE
  async searchVehicles(query: string): Promise<Vehicle[]> {
    if (!query || !query.trim()) {
      return [];
    }

    try {
      const sanitizedQuery = query.trim();
      
      return await this.vehicleModel.find({
        $or: [
          { brand: { $regex: sanitizedQuery, $options: 'i' } },
          { model: { $regex: sanitizedQuery, $options: 'i' } }
        ]
      })
      .select('_id brand model category dailyPrice vehicleImages pickupLocation') 
      .limit(8)
      .exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to process database vehicle search operations.');
    }
  }

  // ONBOARDING STORAGE LOGIC CORE
  async create(
    vehicleData: any, 
    vehicleImages: Record<string, string>, 
    documentFiles: Record<string, string>
  ): Promise<Vehicle> {
    
    const newRecord = new this.vehicleModel({
      ...vehicleData,
      vehicleImages,
      documentFiles,
      approvalStatus: 'PENDING',
      createdAt: new Date()
    });

    return await newRecord.save();
  }

  // CUSTOMER FACING FETCH LOGIC
  async findByCategory(category: string): Promise<Vehicle[]> {
    try {
      const normalizedCategory = (category || '').trim();
      const categoryFilter = normalizedCategory
        ? { category: { $regex: `^${normalizedCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
        : {};

      return await this.vehicleModel.find(categoryFilter)
        .select('_id brand model modelYear dailyPrice fuelType transmission pickupLocation addressCity vehicleImages category')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve vehicles for this category.');
    }
  }

  // Vehicle details fetch logic
  async findById(id: string): Promise<Vehicle> {
    try {
      const match = await this.vehicleModel.findById(id).exec();
      if (!match) throw new NotFoundException('Vehicle target missing.');
      return match;
    } catch (error) {
      throw new InternalServerErrorException('Database aggregation fault.');
    }
  }

  // Get vehicle counts by category for dashboard display
  async getCategoryCounts() {
    return await this.vehicleModel.aggregate([
      {
        $match: {
          approvalStatus: 'PENDING' 
        }
      },
      {
        $group: {
          _id: '$category', 
          count: { $sum: 1 },
        },
      },
    ]);
  }

  // Toggle Saved Vehicles (Save / Unsave logic)
  async toggleSaveVehicle(customerId: string, vehicleId: string): Promise<{ saved: boolean; message: string }> {
    try {
      const cId = new Types.ObjectId(customerId);
      const vId = new Types.ObjectId(vehicleId);

      const existingSave = await this.savedVehicleModel.findOne({ customerId: cId, vehicleId: vId }).exec();

      if (existingSave) {
        await this.savedVehicleModel.findByIdAndDelete(existingSave._id).exec();
        return { saved: false, message: 'Removed from saved listings.' };
      }

      await new this.savedVehicleModel({ customerId: cId, vehicleId: vId }).save();
      return { saved: true, message: 'Saved to your listings.' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update wishlist status.');
    }
  }

  // Check Wishlist Status
  async checkSaveStatus(customerId: string, vehicleId: string): Promise<{ saved: boolean }> {
    try {
      const count = await this.savedVehicleModel.countDocuments({
        customerId: new Types.ObjectId(customerId),
        vehicleId: new Types.ObjectId(vehicleId),
      }).exec();
      return { saved: count > 0 };
    } catch (error) {
      throw new InternalServerErrorException('Failed to read wishlist status parameters.');
    }
  }

  // get SavedVehicles By User

async getSavedVehiclesByUser(customerId: string) {
  try {
    const savedRecords = await this.savedVehicleModel
      .find({ customerId: new Types.ObjectId(customerId) })
      .populate({
        path: 'vehicleId',
        select: '_id brand model category dailyPrice fuelType transmission pickupLocation addressCity vehicleImages'
      })
      .exec();

    // Filter out any populated documents that might be null (e.g., if vehicle was deleted)
    return savedRecords
      .map(record => record.vehicleId)
      .filter(vehicle => vehicle !== null);
  } catch (error) {
    throw new InternalServerErrorException('Failed to retrieve user saved vehicles.');
  }
}
}