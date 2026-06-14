import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, enum: ['customer', 'renter'] })
  role!: string; 

  @Prop({ default: false })
  isCorporateEntity!: boolean;

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string; 

  @Prop({
    type: {
      town: { type: String, required: true },
      district: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  location!: {
    town: string;
    district: string;
  };

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ required: true })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);