import TimeSlot from '../models/TimeSlot.js';
import Barber from '../models/Barber.js';
import logger from '../utils/logger.js';

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { barberId, date } = req.query;
    const slots = await TimeSlot.find({
      barber: barberId,
      date: new Date(date),
      status: 'available',
    });
    res.json({ slots });
  } catch (error) {
    next(error);
  }
};

export const createSlot = async (req, res, next) => {
  try {
    const { date, startTime, endTime } = req.body;

    const barberProfile = await Barber.findOne({ user: req.user.id }).select('_id');
    if (!barberProfile) {
      return res.status(404).json({ message: 'Barber profile not found' });
    }

    const slot = new TimeSlot({
      barber: barberProfile._id,
      date,
      startTime,
      endTime,
    });
    await slot.save();
    res.status(201).json({ message: 'Slot created', slot });
    logger.info(`Slot created: ${slot._id}`);
  } catch (error) {
    next(error);
  }
};