import Review from '../models/Review.js';
import Barber from '../models/Barber.js';
import logger from '../utils/logger.js';

export const createReview = async (req, res, next) => {
  try {
    const { booking, barber, rating, comment, categories } = req.body;
    const review = new Review({
      booking,
      customer: req.user.id,
      barber,
      rating,
      comment,
      categories,
    });
    await review.save();

    // Update barber rating
    const reviews = await Review.find({ barber });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Barber.findByIdAndUpdate(barber, { averageRating: avgRating, totalReviews: reviews.length });

    res.status(201).json({ message: 'Review created', review });
    logger.info(`Review created: ${review._id}`);
  } catch (error) {
    next(error);
  }
};

export const getBarberReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ barber: req.params.barberId })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};