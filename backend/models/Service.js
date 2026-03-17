import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide service name'],
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
    barbers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber',
      },
    ],
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ shop: 1, isActive: 1, displayOrder: 1 });
serviceSchema.index({ shop: 1, category: 1 });

export default mongoose.model('Service', serviceSchema);