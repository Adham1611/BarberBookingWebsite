import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'pro', 'premium'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled', 'pending'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      },
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer'],
    },
    basePrice: Number,
    discount: {
      type: Number,
      default: 0,
    },
    totalPrice: Number,
    features: {
      maxBarbers: { type: Number, default: 2 },
      maxServices: { type: Number, default: 10 },
      maxMonthlyBookings: { type: Number, default: 100 },
      analyticsAccess: { type: Boolean, default: false },
      smsNotifications: { type: Boolean, default: false },
      customBranding: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
    },
    usage: {
      currentMonth: {
        bookings: { type: Number, default: 0 },
        barbers: { type: Number, default: 0 },
        services: { type: Number, default: 0 },
      },
    },
    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true }
);

subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ plan: 1 });

export default mongoose.model('Subscription', subscriptionSchema);
