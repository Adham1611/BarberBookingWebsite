import mongoose from 'mongoose';

const dayHoursSchema = new mongoose.Schema(
  {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' },
  },
  { _id: false }
);

const breakTimeSchema = new mongoose.Schema(
  {
    start: { type: String, default: '13:00' },
    end: { type: String, default: '14:00' },
  },
  { _id: false }
);

const barberSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialties: [String],
    bio: String,
    profileImage: String,
    yearsOfExperience: Number,
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    workingHours: {
      monday: { type: dayHoursSchema, default: () => ({ start: '09:00', end: '18:00' }) },
      tuesday: { type: dayHoursSchema, default: () => ({ start: '09:00', end: '18:00' }) },
      wednesday: { type: dayHoursSchema, default: () => ({ start: '09:00', end: '18:00' }) },
      thursday: { type: dayHoursSchema, default: () => ({ start: '09:00', end: '18:00' }) },
      friday: { type: dayHoursSchema, default: () => ({ start: '09:00', end: '18:00' }) },
      saturday: { type: dayHoursSchema, default: () => ({ start: '10:00', end: '17:00' }) },
      sunday: { type: dayHoursSchema, default: () => ({ start: 'OFF', end: 'OFF' }) },
    },
    breakTime: {
      type: breakTimeSchema,
      default: () => ({ start: '13:00', end: '14:00' }),
    },
    daysOff: [Date],
  },
  {
    timestamps: true,
  }
);

barberSchema.index({ shop: 1, user: 1 });
barberSchema.index({ shop: 1, averageRating: -1, totalBookings: -1 });

export default mongoose.model('Barber', barberSchema);