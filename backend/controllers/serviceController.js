import Service from '../models/Service.js';
import logger from '../utils/logger.js';

export const getAllServices = async (req, res, next) => {
  try {
    const { isActive = true } = req.query;

    const services = await Service.find({ isActive })
      .sort({ displayOrder: 1 })
      .lean();

    res.json({
      services,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { name, description, price, duration, icon, category } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({
        message: 'Name, price, and duration are required',
      });
    }

    const service = new Service({
      name,
      description,
      price,
      duration,
      icon,
      category,
    });

    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });

    logger.info(`Service created: ${name}`);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { name, description, price, duration, icon, isActive } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        duration,
        icon,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service updated successfully',
      service,
    });

    logger.info(`Service updated: ${service.name}`);
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
    logger.info(`Service deleted: ${service.name}`);
  } catch (error) {
    next(error);
  }
};