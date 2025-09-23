import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Client {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ type: String, trim: true })
  notes?: string;

  @Prop({ type: Date })
  subscriptionStartDate?: Date;

  @Prop({ type: Date })
  subscriptionEndDate?: Date;

  @Prop({ type: Date })
  nextRenewalDate?: Date;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);