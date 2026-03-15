import mongoose from 'mongoose';

const barberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
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
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '17:00' },
      sunday: { start: 'OFF', end: 'OFF' },
    },
    breakTime: {
      start: '13:00',
      end: '14:00',
    },
    daysOff: [Date],
  },
  {
    timestamps: true,
  }
);

barberSchema.index({ averageRating: -1, totalBookings: -1 });
barberSchema.index({ 'user._id': 1 });

export default mongoose.model('Barber', barberSchema);