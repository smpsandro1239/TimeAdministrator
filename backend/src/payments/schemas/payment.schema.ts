import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SubscriptionPeriod } from '../../subscriptions/enums/subscription-period.enum';

export type PaymentDocument = Payment & Document;

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
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subscription' })
  subscriptionId?: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'EUR' })
  currency: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ enum: PaymentMethod, required: true })
  method: PaymentMethod;

  @Prop({ enum: SubscriptionPeriod, required: true })
  subscriptionPeriod: SubscriptionPeriod;

  @Prop({ type: String })
  stripePaymentIntentId?: string;

  @Prop({ type: String })
  receiptUrl?: string;

  @Prop({ type: String })
  proofOfPaymentUrl?: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: Date })
  paidAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop({ type: Date })
  approvedAt?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);