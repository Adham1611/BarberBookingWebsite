import Booking from '../models/Booking.js';
import logger from '../utils/logger.js';

export const createBooking = async (req, res, next) => {
  try {
    const { barber, service, bookingDate, startTime, notes } = req.body;
    const booking = new Booking({
      customer: req.user.id,
      barber,
      service,
      bookingDate,
      startTime,
      notes,
    });
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
    logger.info(`Booking created: ${booking._id}`);
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('barber service');
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelledAt: new Date(), cancelledBy: 'customer' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking cancelled', booking });
    logger.info(`Booking cancelled: ${req.params.id}`);
  } catch (error) {
    next(error);
  }
};