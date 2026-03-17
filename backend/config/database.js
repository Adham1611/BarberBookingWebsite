import mongoose from 'mongoose';

export let isDbConnected = false;

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barber-booking');
    isDbConnected = true;
    console.log('✅ MongoDB Connected');
    return true;
  } catch (error) {
    isDbConnected = false;
    console.error('❌ DB Error:', error.message);

    if (process.env.ALLOW_NO_DB === 'true') {
      console.warn('⚠️ Starting server without database connection (ALLOW_NO_DB=true).');
      return false;
    }

    process.exit(1);
  }
};