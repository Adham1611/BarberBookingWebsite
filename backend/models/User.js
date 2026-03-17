import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,}$/, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/200',
    },
    role: {
      type: String,
      enum: ['customer', 'barber', 'owner', 'admin'],
      default: 'customer',
    },
    bio: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
    googleId: String,
    appleId: String,
    lastLogin: Date,
    // Multi-tenant fields
    shops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
      },
    ],
    primaryShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    // For barber staff members
    barberProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);