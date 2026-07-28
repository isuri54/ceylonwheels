import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicleId!: Types.ObjectId;

  @Prop({ required: true }) 
  pickupDate!: Date;

  @Prop({ required: true }) 
  pickupTime!: string;

  @Prop({ required: true }) 
  returnDate!: Date;

  @Prop({ required: true }) 
  returnTime!: string;

  @Prop({ required: true, enum: ['Pickup', 'Delivery'] })
  pickupMethod!: 'Pickup' | 'Delivery';

  @Prop() 
  deliveryAddress?: string;

  @Prop() 
  rentalPurpose?: string;

  @Prop() 
  travelArea?: string;

  @Prop() 
  specialRequests?: string;

  @Prop({ required: true }) 
  dailyRate!: number;

  @Prop({ required: true }) 
  totalDays!: number; // Fixed with !

  @Prop({ required: true }) 
  securityDeposit!: number;

  @Prop({ required: true }) 
  totalAmount!: number;

  @Prop({ required: true, default: 'Pending' })
  status!: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

  @Prop({ required: true }) 
  acceptedTermsTimestamp!: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);