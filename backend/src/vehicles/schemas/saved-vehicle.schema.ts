import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavedVehicleDocument = SavedVehicle & Document;

@Schema({ timestamps: true })
export class SavedVehicle {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  customerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Vehicle' })
  vehicleId!: Types.ObjectId;
}

export const SavedVehicleSchema = SchemaFactory.createForClass(SavedVehicle);

// Protect against duplicate saves via compound indexing
SavedVehicleSchema.index({ customerId: 1, vehicleId: 1 }, { unique: true });