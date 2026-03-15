import User from '../models/User.js';
import logger from '../utils/logger.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        avatar: avatar || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });

    logger.info(`User profile updated: ${user.email}`);
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Profile deleted successfully' });
    logger.info(`User profile deleted: ${req.user.id}`);
  } catch (error) {
    next(error);
  }
};