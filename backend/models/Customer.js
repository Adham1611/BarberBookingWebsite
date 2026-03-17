import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birthday: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    notes: String,
    tags: [String],
    stats: {
      totalBookings: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
      lastBookingDate: Date,
      lastVisitDate: Date,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    preferences: {
      preferredBarber: mongoose.Schema.Types.ObjectId,
      preferredServices: [mongoose.Schema.Types.ObjectId],
      receiveNotifications: { type: Boolean, default: true },
      receivePromotions: { type: Boolean, default: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

customerSchema.index({ shop: 1, phone: 1 });
customerSchema.index({ shop: 1, email: 1 });
customerSchema.index({ shop: 1, createdAt: -1 });

export default mongoose.model('Customer', customerSchema);
