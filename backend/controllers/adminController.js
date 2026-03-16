import User from '../models/User.js';
import Booking from '../models/Booking.js';
import logger from '../utils/logger.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('customer barber service');
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
    logger.info(`User deleted: ${req.params.id}`);
  } catch (error) {
    next(error);
  }
};