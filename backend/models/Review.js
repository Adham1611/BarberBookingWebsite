import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
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
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    categories: {
      skillLevel: Number,
      cleanliness: Number,
      communication: Number,
      timeManagement: Number,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ barber: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);