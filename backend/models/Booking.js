import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    notes: String,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: String,
    amount: Number,
    cancellationReason: String,
    cancelledBy: {
      type: String,
      enum: ['customer', 'barber', 'admin'],
    },
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ barber: 1, bookingDate: 1, startTime: 1, status: 1 });
bookingSchema.index({ customer: 1, bookingDate: 1 });
bookingSchema.index({ status: 1, bookingDate: 1 });

export default mongoose.model('Booking', bookingSchema);