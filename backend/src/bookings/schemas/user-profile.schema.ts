import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({ _id: false })
class Address {
  @Prop({ required: true }) houseNumber!: string;
  @Prop({ required: true }) street!: string;
  @Prop({ required: true }) city!: string;
  @Prop({ required: true }) district!: string;
  @Prop({ required: true }) postalCode!: string;
}

@Schema({ _id: false })
class LicenseInfo {
  @Prop({ required: true }) licenseNumber!: string;
  @Prop({ required: true }) expiryDate!: Date;
  @Prop({ required: true }) frontUrl!: string;
  @Prop({ required: true }) backUrl!: string;
}

@Schema({ _id: false })
class EmergencyContact {
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) relationship!: string;
  @Prop({ required: true }) phone!: string;
}

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId!: Types.ObjectId;

  @Prop({ required: true }) fullName!: string;
  @Prop({ required: true }) dateOfBirth!: Date;
  @Prop() gender?: string;
  @Prop({ required: true }) mobileNumber!: string;

  @Prop({ required: true, enum: ['SriLankan', 'Foreigner'] })
  citizenshipType!: 'SriLankan' | 'Foreigner';

  @Prop() nicNumber?: string;
  @Prop() nicFrontUrl?: string;
  @Prop() nicBackUrl?: string;

  @Prop() passportNumber?: string;
  @Prop() passportPhotoUrl?: string;
  @Prop() country?: string;

  @Prop({ required: true }) selfieUrl!: string;

  @Prop({ type: Address, required: true })
  address!: Address;

  @Prop({ type: LicenseInfo, required: true })
  drivingLicense!: LicenseInfo;

  @Prop({ type: EmergencyContact, required: true })
  emergencyContact!: EmergencyContact;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);