import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      unique: true,
    },
    description: String,
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, 'Please provide duration in minutes'],
      min: 5,
    },
    icon: String,
    image: String,
    category: {
      type: String,
      enum: ['haircut', 'beard', 'grooming', 'specialty'],
      default: 'haircut',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: Number,
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model('Service', serviceSchema);