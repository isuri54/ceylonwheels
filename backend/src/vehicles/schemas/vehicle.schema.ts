import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  // 1. Vehicle Information
  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  brand!: string;

  @Prop({ required: true })
  model!: string;

  @Prop({ required: true })
  modelYear!: number;

  @Prop({ required: true, unique: true })
  registrationNumber!: string;

  @Prop({ required: true, unique: true })
  chassisNumber!: string;

  @Prop({ required: true })
  engineNumber!: string;

  @Prop({ required: true })
  color!: string;

  @Prop({ required: true })
  fuelType!: string;

  @Prop({ required: true })
  transmission!: string;

  @Prop({ required: true })
  seatingCapacity!: number;

  @Prop({ required: true })
  doorsCount!: number;

  @Prop({ required: true })
  currentMileage!: number;

  @Prop({ required: true })
  airConditioning!: string;

  @Prop({ required: true })
  driverIncludedAvailable!: string;

  // 2. Rental Information & Calendar Parameters
  @Prop({ required: true })
  dailyPrice!: number;

  @Prop({ type: Number, default: null })
  weeklyPrice!: number | null;

  @Prop({ type: Number, default: null })
  monthlyPrice!: number | null;

  @Prop({ required: true })
  securityDeposit!: number;

  @Prop({ required: true, default: 1 })
  minimumRentalPeriod!: number;

  @Prop({ type: Number, default: null })
  maximumRentalPeriod!: number | null;

  @Prop({ required: true })
  pickupLocation!: string;

  @Prop({ default: 'No' })
  deliveryAvailable!: string;

  @Prop({ default: 0 })
  deliveryCharges!: number;

  @Prop({ default: '' })
  allowedDistricts!: string;

  @Prop({ default: 'Full to Full' })
  fuelPolicy!: string;

  @Prop({ required: true })
  lateReturnFee!: number;

  @Prop({ required: true })
  extraKmCharge!: number;

  @Prop({ default: 'No' })
  smokingAllowed!: string;

  @Prop({ default: 'No' })
  petsAllowed!: string;

  @Prop({ default: '' })
  availableStartDate!: string;

  @Prop({ default: '' })
  availableEndDate!: string;

  @Prop({ type: [String], default: [] })
  blockedDates!: string[];

  // 3 & 4. Uploaded File Dictionaries
  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  vehicleImages!: Record<string, string>; 

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  documentFiles!: Record<string, string>; 

  // 5. Renter Identity Details
  @Prop({ required: true })
  ownerName!: string;

  @Prop({ required: true })
  ownerPhone!: string;

  @Prop({ required: true })
  ownerEmail!: string;

  @Prop({ required: true })
  nicNumber!: string;

  @Prop({ required: true, default: 'Owner' })
  ownershipConfirmationType!: string;

  @Prop({ required: true })
  bankAccountHolder!: string;

  @Prop({ required: true })
  bankName!: string;

  @Prop({ required: true })
  bankBranch!: string;

  @Prop({ required: true })
  bankAccountNumber!: string;

  @Prop({ required: true })
  addressHouseNumber!: string;

  @Prop({ required: true })
  addressStreet!: string;

  @Prop({ required: true })
  addressCity!: string;

  @Prop({ required: true })
  addressDistrict!: string;

  @Prop({ required: true })
  addressPostalCode!: string;

  //System Flags
  @Prop({ default: 'PENDING' })
  approvalStatus!: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);