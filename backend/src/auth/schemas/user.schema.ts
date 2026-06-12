import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  RENTER = 'renter',
  CUSTOMER = 'customer',
}

export enum RenterType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ type: String, enum: RenterType })
  renterType?: RenterType;
}

export const UserSchema = SchemaFactory.createForClass(User);
