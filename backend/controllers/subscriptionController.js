import Subscription from '../models/Subscription.js';
import Shop from '../models/Shop.js';
import logger from '../utils/logger.js';

// Get all subscription plans with pricing
export const getPlans = async (req, res, next) => {
  try {
    const plans = {
      free: {
        name: 'Free',
        price: 0,
        features: {
          maxBarbers: 1,
          maxServices: 3,
          maxMonthlyBookings: 30,
          analyticsAccess: false,
          smsNotifications: false,
          customBranding: false,
          prioritySupport: false,
        },
        description: 'Perfect for getting started',
      },
      starter: {
        name: 'Starter',
        price: 29.99,
        features: {
          maxBarbers: 2,
          maxServices: 10,
          maxMonthlyBookings: 100,
          analyticsAccess: true,
          smsNotifications: false,
          customBranding: false,
          prioritySupport: false,
        },
        description: 'For growing shops',
      },
      pro: {
        name: 'Pro',
        price: 79.99,
        features: {
          maxBarbers: 8,
          maxServices: null, // unlimited
          maxMonthlyBookings: null, // unlimited
          analyticsAccess: true,
          smsNotifications: true,
          customBranding: true,
          prioritySupport: false,
        },
        description: 'For established shops',
      },
      premium: {
        name: 'Premium',
        price: 199.99,
        features: {
          maxBarbers: null, // unlimited
          maxServices: null, // unlimited
          maxMonthlyBookings: null, // unlimited
          analyticsAccess: true,
          smsNotifications: true,
          customBranding: true,
          prioritySupport: true,
        },
        description: 'For franchise operations',
      },
    };

    res.json(plans);
  } catch (error) {
    next(error);
  }
};

// Get current subscription details
export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ shop: req.shopId })
      .populate('shop', 'name stats');

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

// Check if shop has reached feature limit
export const checkFeatureLimit = async (req, res, next) => {
  try {
    const { feature } = req.query; // 'barbers', 'services', 'bookings'

    if (!feature) {
      return res.status(400).json({ message: 'Feature parameter required' });
    }

    const subscription = await Subscription.findOne({ shop: req.shopId });

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    const shop = await Shop.findById(req.shopId);
    const featureMap = {
      barbers: { limit: subscription.features.maxBarbers, current: shop.stats.totalBarbers },
      services: { limit: subscription.features.maxServices, current: shop.stats.totalServices },
      bookings: { limit: subscription.features.maxMonthlyBookings, current: subscription.usage.currentMonth.bookings },
    };

    const featureLimitInfo = featureMap[feature];
    if (!featureLimitInfo) {
      return res.status(400).json({ message: 'Invalid feature' });
    }

    const isLimited = featureLimitInfo.limit !== null && featureLimitInfo.current >= featureLimitInfo.limit;

    res.json({
      feature,
      limit: featureLimitInfo.limit,
      current: featureLimitInfo.current,
      isLimited,
      message: isLimited ? `Monthly ${feature} limit reached` : 'Limit not reached',
    });
  } catch (error) {
    next(error);
  }
};

// Track usage (called when booking/service/barber created)
export const trackUsage = async (shopId, type) => {
  try {
    const subscription = await Subscription.findOne({ shop: shopId });

    if (!subscription) {
      logger.warn(`No subscription found for shop: ${shopId}`);
      return;
    }

    // Get current date info
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Initialize month tracking if needed
    if (!subscription.usage.currentMonth.month || subscription.usage.currentMonth.month !== currentMonth) {
      subscription.usage.currentMonth = {
        month: currentMonth,
        bookings: 0,
        barbers: 0,
        services: 0,
      };
    }

    // Increment counter
    if (type === 'booking') {
      subscription.usage.currentMonth.bookings += 1;
    } else if (type === 'barber') {
      subscription.usage.currentMonth.barbers += 1;
    } else if (type === 'service') {
      subscription.usage.currentMonth.services += 1;
    }

    await subscription.save();
  } catch (error) {
    logger.error(`Error tracking usage: ${error.message}`);
  }
};

// Pause subscription (owner)
export const pauseSubscription = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
      { shop: req.shopId },
      { status: 'paused', pauseReason: reason },
      { new: true }
    );

    logger.info(`Subscription paused for shop: ${req.shopId}`);
    res.json({ message: 'Subscription paused', subscription });
  } catch (error) {
    next(error);
  }
};

// Resume subscription (owner)
export const resumeSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { shop: req.shopId, status: 'paused' },
      { status: 'active', pauseReason: null },
      { new: true }
    );

    if (!subscription) {
      return res.status(400).json({ message: 'Cannot resume non-paused subscription' });
    }

    logger.info(`Subscription resumed for shop: ${req.shopId}`);
    res.json({ message: 'Subscription resumed', subscription });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription (owner)
export const cancelSubscription = async (req, res, next) => {
  try {
    const { reason, feedback } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
      { shop: req.shopId },
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason,
        cancellationFeedback: feedback,
      },
      { new: true }
    );

    logger.info(`Subscription cancelled for shop: ${req.shopId}`);
    res.json({ message: 'Subscription cancelled', subscription });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all subscriptions
export const getSubscriptions = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { plan, status } = req.query;
    let filter = {};

    if (plan) filter.plan = plan;
    if (status) filter.status = status;

    const subscriptions = await Subscription.find(filter)
      .populate('shop', 'name owner')
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

// Admin: Get subscription analytics
export const getSubscriptionAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const subscriptions = await Subscription.find();
    const totalSubscriptions = subscriptions.length;

    const planCounts = {
      free: subscriptions.filter(s => s.plan === 'free').length,
      starter: subscriptions.filter(s => s.plan === 'starter').length,
      pro: subscriptions.filter(s => s.plan === 'pro').length,
      premium: subscriptions.filter(s => s.plan === 'premium').length,
    };

    const status_counts = {
      active: subscriptions.filter(s => s.status === 'active').length,
      paused: subscriptions.filter(s => s.status === 'paused').length,
      cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
      pending: subscriptions.filter(s => s.status === 'pending').length,
    };

    res.json({
      totalSubscriptions,
      planCounts,
      status_counts,
    });
  } catch (error) {
    next(error);
  }
};
