import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';
import Barber from '../models/Barber.js';
import Service from '../models/Service.js';
import Shop from '../models/Shop.js';
import Subscription from '../models/Subscription.js';
import logger from '../utils/logger.js';
import { getAvailableSlots, isSlotAvailable, getAvailableBarbers } from '../utils/bookingSlotResolver.js';
import { trackUsage } from '../controllers/subscriptionController.js';

export const createBooking = async (req, res, next) => {
  try {
    const { barberId, serviceId, bookingDate, startTime, customerId, customerEmail, customerPhone, notes } = req.body;

    // Validate required fields
    if (!barberId || !serviceId || !bookingDate || !startTime) {
      return res.status(400).json({ message: 'Missing required booking details' });
    }

    // Check if customer has reached booking limit for subscription
    const subscription = await Subscription.findOne({ shop: req.shopId });
    if (subscription && subscription.features.maxMonthlyBookings) {
      const currentMonth = new Date();
      const monthBookings = await Booking.countDocuments({
        shop: req.shopId,
        createdAt: {
          $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        },
        status: { $ne: 'cancelled' },
      });

      if (monthBookings >= subscription.features.maxMonthlyBookings) {
        return res.status(403).json({ message: 'Monthly booking limit reached. Upgrade subscription.' });
      }
    }

    // Verify barber and service belong to this shop
    const barber = await Barber.findOne({ _id: barberId, shop: req.shopId });
    if (!barber) return res.status(404).json({ message: 'Barber not found' });

    const service = await Service.findOne({ _id: serviceId, shop: req.shopId });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Calculate end time based on service duration
    const [hourStr, minStr] = startTime.split(':');
    const startMinutes = parseInt(hourStr) * 60 + parseInt(minStr);
    const endMinutes = startMinutes + (service.duration || 30);
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    // Check if slot is available
    const slotAvailable = await isSlotAvailable({
      shopId: req.shopId,
      barberId,
      bookingDate,
      startTime,
      endTime,
    });

    if (!slotAvailable) {
      return res.status(409).json({ message: 'Slot is not available' });
    }

    // Handle customer (either existing Customer model or authenticated User)
    let customerObj = null;
    if (customerId) {
      customerObj = await Customer.findOne({ _id: customerId, shop: req.shopId });
      if (!customerObj) return res.status(404).json({ message: 'Customer not found' });
    } else if (customerEmail || customerPhone) {
      // Create walk-in customer
      customerObj = new Customer({
        shop: req.shopId,
        email: customerEmail,
        phone: customerPhone,
      });
      await customerObj.save();
    } else if (req.user) {
      // Use authenticated user
      customerObj = null; // Will use customerUser field
    }

    // Create booking
    const booking = new Booking({
      shop: req.shopId,
      barber: barberId,
      service: serviceId,
      customer: customerObj?._id,
      customerUser: req.user?.id,
      bookingDate,
      startTime,
      endTime,
      notes,
      status: 'confirmed',
      createdBy: req.user?.id || 'walk-in',
    });

    await booking.save();

    // Update customer stats if customer exists
    if (customerObj) {
      customerObj.totalBookings += 1;
      customerObj.lastBookingDate = new Date();
      await customerObj.save();
    }

    // Track usage for subscription
    await trackUsage(req.shopId, 'booking');

    logger.info(`Booking created: ${booking._id} in shop ${req.shopId}`);
    res.status(201).json({ message: 'Booking created successfully', booking: booking.populate(['barber', 'service', 'customer']) });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    // Get all bookings for this shop
    let filter = { shop: req.shopId };

    const { status, barber, startDate, endDate } = req.query;

    if (status) filter.status = status;
    if (barber) filter.barber = barber;

    if (startDate || endDate) {
      filter.bookingDate = {};
      if (startDate) filter.bookingDate.$gte = new Date(startDate);
      if (endDate) filter.bookingDate.$lte = new Date(endDate);
    }

    // Only customers see their own bookings
    if (req.user.role === 'customer') {
      filter.$or = [
        { customerUser: req.user.id },
        { 'customer.email': req.user.email },
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('barber', 'name averageRating')
      .populate('service', 'name duration price')
      .populate('customer', 'firstName lastName phone email')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlotsController = async (req, res, next) => {
  try {
    const { barberId, serviceId, bookingDate } = req.query;

    if (!barberId || !serviceId || !bookingDate) {
      return res.status(400).json({ message: 'Barber, service, and date required' });
    }

    const slots = await getAvailableSlots({
      shopId: req.shopId,
      barberId,
      serviceId,
      bookingDate,
    });

    res.json(slots);
  } catch (error) {
    next(error);
  }
};

export const getAvailableBarbersController = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, startTime, duration } = req.query;

    if (!serviceId || !bookingDate || !startTime) {
      return res.status(400).json({ message: 'Service, date, and start time required' });
    }

    const barbers = await getAvailableBarbers({
      shopId: req.shopId,
      serviceId,
      bookingDate,
      startTime,
      duration,
    });

    res.json(barbers);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    let filter = { _id: req.params.id, shop: req.shopId };

    // Only allow customer to cancel own booking, barber/owner can cancel any
    if (req.user.role === 'customer') {
      filter.$or = [
        { customerUser: req.user.id },
        { 'customer.email': req.user.email },
      ];
    }

    const booking = await Booking.findOneAndUpdate(
      filter,
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: req.user.role,
      },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Update customer stats
    if (booking.customer) {
      const customer = await Customer.findById(booking.customer);
      if (customer && customer.totalBookings > 0) {
        customer.totalBookings -= 1;
        await customer.save();
      }
    }

    logger.info(`Booking cancelled: ${req.params.id}`);
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};