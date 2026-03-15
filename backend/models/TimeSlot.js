import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available',
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  {
    timestamps: true,
  }
);

timeSlotSchema.index({ barber: 1, date: 1, startTime: 1 });
timeSlotSchema.index({ barber: 1, date: 1, status: 1 });

export default mongoose.model('TimeSlot', timeSlotSchema);