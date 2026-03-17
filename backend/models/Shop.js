import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
    workingHours: {
      monday: { open: String, close: String, isClosed: Boolean },
      tuesday: { open: String, close: String, isClosed: Boolean },
      wednesday: { open: String, close: String, isClosed: Boolean },
      thursday: { open: String, close: String, isClosed: Boolean },
      friday: { open: String, close: String, isClosed: Boolean },
      saturday: { open: String, close: String, isClosed: Boolean },
      sunday: { open: String, close: String, isClosed: Boolean },
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    settings: {
      bufferTimeInMinutes: { type: Number, default: 0 },
      maxDaysInAdvance: { type: Number, default: 90 },
      minTimeBeforeBooking: { type: Number, default: 15 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stats: {
      totalBarbers: { type: Number, default: 0 },
      totalServices: { type: Number, default: 0 },
      totalBookings: { type: Number, default: 0 },
      totalCustomers: { type: Number, default: 0 },
      monthlyRevenue: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

shopSchema.index({ owner: 1 });
shopSchema.index({ isActive: 1 });

export default mongoose.model('Shop', shopSchema);
