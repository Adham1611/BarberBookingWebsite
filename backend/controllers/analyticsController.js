import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';
import Barber from '../models/Barber.js';
import Service from '../models/Service.js';
import Shop from '../models/Shop.js';
import Subscription from '../models/Subscription.js';
import logger from '../utils/logger.js';

// ─── Owner Dashboard ────────────────────────────────────────────────────────

// Overview: bookings, revenue, customers, barbers for a shop
export const getShopOverview = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalBookings,
      monthBookings,
      lastMonthBookings,
      totalCustomers,
      newCustomersThisMonth,
      totalBarbers,
      totalServices,
      subscription,
    ] = await Promise.all([
      Booking.countDocuments({ shop: shopId, status: { $ne: 'cancelled' } }),
      Booking.countDocuments({ shop: shopId, status: { $ne: 'cancelled' }, createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ shop: shopId, status: { $ne: 'cancelled' }, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Customer.countDocuments({ shop: shopId }),
      Customer.countDocuments({ shop: shopId, createdAt: { $gte: startOfMonth } }),
      Barber.countDocuments({ shop: shopId, isActive: true }),
      Service.countDocuments({ shop: shopId, isActive: true }),
      Subscription.findOne({ shop: shopId }),
    ]);

    // Revenue from confirmed bookings this month
    const revenueAgg = await Booking.aggregate([
      { $match: { shop: shopId, status: { $in: ['confirmed', 'completed'] }, createdAt: { $gte: startOfMonth } } },
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceData' } },
      { $unwind: { path: '$serviceData', preserveNullAndEmpty: true } },
      { $group: { _id: null, total: { $sum: '$serviceData.price' } } },
    ]);

    const lastMonthRevenueAgg = await Booking.aggregate([
      { $match: { shop: shopId, status: { $in: ['confirmed', 'completed'] }, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceData' } },
      { $unwind: { path: '$serviceData', preserveNullAndEmpty: true } },
      { $group: { _id: null, total: { $sum: '$serviceData.price' } } },
    ]);

    const revenueThisMonth = revenueAgg[0]?.total || 0;
    const revenueLastMonth = lastMonthRevenueAgg[0]?.total || 0;

    const bookingGrowth = lastMonthBookings > 0
      ? (((monthBookings - lastMonthBookings) / lastMonthBookings) * 100).toFixed(1)
      : 100;

    const revenueGrowth = revenueLastMonth > 0
      ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)
      : 100;

    res.json({
      overview: {
        totalBookings,
        monthBookings,
        bookingGrowth: parseFloat(bookingGrowth),
        revenueThisMonth,
        revenueLastMonth,
        revenueGrowth: parseFloat(revenueGrowth),
        totalCustomers,
        newCustomersThisMonth,
        totalBarbers,
        totalServices,
      },
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        usage: subscription.usage,
        features: subscription.features,
      } : null,
    });
  } catch (error) {
    logger.error(`Analytics overview error: ${error.message}`);
    next(error);
  }
};

// Bookings over time (last 30 days)
export const getBookingTrends = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const shopId = req.shopId;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const bookings = await Booking.aggregate([
      {
        $match: {
          shop: shopId,
          createdAt: { $gte: since },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const trend = bookings.map(b => ({
      date: `${b._id.year}-${String(b._id.month).padStart(2, '0')}-${String(b._id.day).padStart(2, '0')}`,
      bookings: b.count,
    }));

    res.json(trend);
  } catch (error) {
    next(error);
  }
};

// Top services by booking count
export const getTopServices = async (req, res, next) => {
  try {
    const shopId = req.shopId;

    const results = await Booking.aggregate([
      { $match: { shop: shopId, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      {
        $project: {
          name: '$service.name',
          price: '$service.price',
          count: 1,
          revenue: { $multiply: ['$count', '$service.price'] },
        },
      },
    ]);

    res.json(results);
  } catch (error) {
    next(error);
  }
};

// Barber performance: bookings, revenue, rating
export const getBarberPerformance = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const results = await Booking.aggregate([
      { $match: { shop: shopId, status: { $ne: 'cancelled' }, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: '$barber', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $lookup: { from: 'barbers', localField: '_id', foreignField: '_id', as: 'barber' } },
      { $unwind: '$barber' },
      {
        $project: {
          name: '$barber.name',
          avatar: '$barber.avatar',
          averageRating: '$barber.averageRating',
          totalBookings: '$count',
        },
      },
    ]);

    res.json(results);
  } catch (error) {
    next(error);
  }
};

// Revenue by month (last 6 months)
export const getRevenueByMonth = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const results = await Booking.aggregate([
      {
        $match: {
          shop: shopId,
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceData' } },
      { $unwind: { path: '$serviceData', preserveNullAndEmpty: true } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$serviceData.price' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const trend = results.map(r => ({
      month: monthNames[r._id.month - 1],
      year: r._id.year,
      revenue: r.revenue,
      bookings: r.bookings,
    }));

    res.json(trend);
  } catch (error) {
    next(error);
  }
};

// Upcoming bookings (next 7 days)
export const getUpcomingBookings = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const bookings = await Booking.find({
      shop: shopId,
      bookingDate: { $gte: now, $lte: sevenDaysLater },
      status: 'confirmed',
    })
      .populate('barber', 'name avatar')
      .populate('service', 'name duration price')
      .populate('customer', 'firstName lastName phone')
      .sort({ bookingDate: 1, startTime: 1 })
      .limit(50);

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// ─── Platform Admin Dashboard ────────────────────────────────────────────────

// Global platform stats
export const getPlatformStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const [
      totalShops,
      activeShops,
      totalUsers,
      totalBookings,
      subscriptionBreakdown,
    ] = await Promise.all([
      Shop.countDocuments(),
      Shop.countDocuments({ isActive: true }),
      // User count via import
      import('../models/User.js').then(({ default: User }) => User.countDocuments()),
      Booking.countDocuments(),
      Subscription.aggregate([
        { $group: { _id: '$plan', count: { $sum: 1 } } },
      ]),
    ]);

    const plans = { free: 0, starter: 0, pro: 0, premium: 0 };
    subscriptionBreakdown.forEach(s => { plans[s._id] = s.count; });

    // Monthly recurring revenue estimate
    const MRR_PRICES = { free: 0, starter: 29.99, pro: 79.99, premium: 199.99 };
    const mrr = Object.entries(plans).reduce((sum, [plan, count]) => {
      return sum + (MRR_PRICES[plan] * count);
    }, 0);

    res.json({
      totalShops,
      activeShops,
      totalUsers,
      totalBookings,
      subscriptionBreakdown: plans,
      estimatedMRR: parseFloat(mrr.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

// Platform revenue trend (admin only)
export const getPlatformRevenueTrend = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const newShopsByMonth = await Shop.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          newShops: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    res.json(newShopsByMonth.map(r => ({
      month: monthNames[r._id.month - 1],
      year: r._id.year,
      newShops: r.newShops,
    })));
  } catch (error) {
    next(error);
  }
};

// List all shops for admin with stats
export const getAdminShopList = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { search, plan, status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let shopFilter = {};
    if (search) {
      shopFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }
    if (status === 'active') shopFilter.isActive = true;
    if (status === 'inactive') shopFilter.isActive = false;

    const shops = await Shop.find(shopFilter)
      .populate('owner', 'name email')
      .populate('subscription', 'plan status usage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Shop.countDocuments(shopFilter);

    // Filter by plan post-populate
    const filtered = plan
      ? shops.filter(s => s.subscription?.plan === plan)
      : shops;

    res.json({ shops: filtered, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// Toggle shop active status (admin)
export const toggleShopStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    shop.isActive = !shop.isActive;
    await shop.save();

    logger.info(`Shop ${shop._id} status toggled to ${shop.isActive} by admin ${req.user.id}`);
    res.json({ message: `Shop ${shop.isActive ? 'activated' : 'deactivated'}`, isActive: shop.isActive });
  } catch (error) {
    next(error);
  }
};
