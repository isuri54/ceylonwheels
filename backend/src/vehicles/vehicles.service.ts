import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>
  ) {}

  // SEARCH LOGIC CORE
  async searchVehicles(query: string): Promise<Vehicle[]> {
    if (!query || !query.trim()) {
      return [];
    }

    try {
      const sanitizedQuery = query.trim();
      
      // Searches both brand or model text contexts cleanly
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
      vehicleImages,  // Mapped dictionary object from file buffers
      documentFiles,  // Mapped dictionary object from document buffers
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
}