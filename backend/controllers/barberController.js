import Barber from '../models/Barber.js';
import logger from '../utils/logger.js';

export const getAllBarbers = async (req, res, next) => {
  try {
    const barbers = await Barber.find({ isAvailable: true })
      .populate('user', 'name email phone avatar')
      .sort({ averageRating: -1 });
    res.json({ barbers });
  } catch (error) {
    next(error);
  }
};

export const getBarberById = async (req, res, next) => {
  try {
    const barber = await Barber.findById(req.params.id).populate('user');
    if (!barber) return res.status(404).json({ message: 'Barber not found' });
    res.json({ barber });
  } catch (error) {
    next(error);
  }
};

export const createBarber = async (req, res, next) => {
  try {
    const { specialties, bio, yearsOfExperience } = req.body;
    const barber = new Barber({
      user: req.user.id,
      specialties,
      bio,
      yearsOfExperience,
    });
    await barber.save();
    res.status(201).json({ message: 'Barber profile created', barber });
    logger.info(`Barber created: ${req.user.id}`);
  } catch (error) {
    next(error);
  }
};

export const updateBarber = async (req, res, next) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!barber) return res.status(404).json({ message: 'Barber not found' });
    res.json({ message: 'Barber updated', barber });
    logger.info(`Barber updated: ${req.params.id}`);
  } catch (error) {
    next(error);
  }
};