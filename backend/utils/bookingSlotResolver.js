import Booking from '../models/Booking.js';
import Barber from '../models/Barber.js';
import Service from '../models/Service.js';
import Shop from '../models/Shop.js';
import logger from '../utils/logger.js';

/**
 * Get available time slots for a barber on a specific date
 * @param {Object} params - { shopId, barberId, serviceId, bookingDate }
 * @returns {Array} Available slots (format: { startTime: '14:00', endTime: '14:30', available: true })
 */
export const getAvailableSlots = async ({ shopId, barberId, serviceId, bookingDate }) => {
  try {
    // Validate inputs
    if (!shopId || !barberId || !serviceId || !bookingDate) {
      throw new Error('Missing required parameters');
    }

    // Get shop settings
    const shop = await Shop.findById(shopId);
    if (!shop) throw new Error('Shop not found');

    // Get barber details
    const barber = await Barber.findOne({ _id: barberId, shop: shopId });
    if (!barber) throw new Error('Barber not found');

    // Get service duration
    const service = await Service.findOne({ _id: serviceId, shop: shopId });
    if (!service) throw new Error('Service not found');

    // Parse booking date
    const date = new Date(bookingDate);
    const dayOfWeek = getDayName(date);

    // Get shop working hours for this day
    const workingHours = shop.workingHours[dayOfWeek];
    if (!workingHours || workingHours.isClosed) {
      return []; // Shop closed on this day
    }

    // Get barber's personal working hours (if set)
    const barberHours = barber.workingHours?.[dayOfWeek];
    const effectiveHours = barberHours || workingHours;

    if (effectiveHours.isClosed) {
      return [];
    }

    // Parse opening/closing times
    const [shopOpenHour, shopOpenMin] = effectiveHours.open.split(':').map(Number);
    const [shopCloseHour, shopCloseMin] = effectiveHours.close.split(':').map(Number);

    const shopOpenMinutes = shopOpenHour * 60 + shopOpenMin;
    const shopCloseMinutes = shopCloseHour * 60 + shopCloseMin;

    // Get existing bookings for this barber on this date
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      shop: shopId,
      barber: barberId,
      bookingDate: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      status: { $in: ['confirmed', 'in-progress'] },
    }).select('startTime endTime');

    // Generate all possible slots (15/30 minute intervals)
    const slots = [];
    const slotInterval = shop.settings?.slotInterval || 30; // minutes
    const bufferTime = shop.settings?.bufferTimeInMinutes || 15; // minutes

    for (let minutes = shopOpenMinutes; minutes < shopCloseMinutes; minutes += slotInterval) {
      const slotStartMinutes = minutes;
      const slotEndMinutes = minutes + (service.duration || slotInterval);

      // Check if slot fits within working hours
      if (slotEndMinutes > shopCloseMinutes) {
        break;
      }

      // Convert back to HH:MM format
      const startTime = minutesToTimeString(slotStartMinutes);
      const endTime = minutesToTimeString(slotEndMinutes);

      // Check for conflicts with existing bookings (considering buffer time)
      const conflictStart = slotStartMinutes - bufferTime;
      const conflictEnd = slotEndMinutes + bufferTime;

      let isAvailable = true;
      for (const booking of existingBookings) {
        const [bookingStartHour, bookingStartMin] = booking.startTime.split(':').map(Number);
        const bookingStartMinutes = bookingStartHour * 60 + bookingStartMin;

        const [bookingEndHour, bookingEndMin] = booking.endTime.split(':').map(Number);
        const bookingEndMinutes = bookingEndHour * 60 + bookingEndMin;

        // Check if slot overlaps with existing booking (including buffer)
        if (
          (slotStartMinutes < bookingEndMinutes + bufferTime && slotEndMinutes + bufferTime > bookingStartMinutes)
        ) {
          isAvailable = false;
          break;
        }
      }

      slots.push({
        startTime,
        endTime,
        available: isAvailable,
      });
    }

    return slots;
  } catch (error) {
    logger.error(`Error getting available slots: ${error.message}`);
    throw error;
  }
};

/**
 * Check specific slot available time
 */
export const isSlotAvailable = async ({
  shopId,
  barberId,
  bookingDate,
  startTime,
  endTime,
}) => {
  try {
    // Get existing bookings
    const dateStart = new Date(bookingDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(bookingDate);
    dateEnd.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.findOne({
      shop: shopId,
      barber: barberId,
      bookingDate: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      status: { $in: ['confirmed', 'in-progress'] },
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
          ],
        },
      ],
    });

    return !existingBookings; // true if no conflicts
  } catch (error) {
    logger.error(`Error checking slot availability: ${error.message}`);
    throw error;
  }
};

/**
 * Get available barbers for a service on a specific date/time
 */
export const getAvailableBarbers = async ({
  shopId,
  serviceId,
  bookingDate,
  startTime,
  duration,
}) => {
  try {
    const service = await Service.findOne({ _id: serviceId, shop: shopId });
    if (!service) throw new Error('Service not found');

    // Get barbers who can perform this service
    const barbers = await Barber.find({
      shop: shopId,
      _id: { $in: service.barbers },
      isActive: true,
    });

    const availableBarbers = [];

    for (const barber of barbers) {
      const available = await isSlotAvailable({
        shopId,
        barberId: barber._id,
        bookingDate,
        startTime,
        endTime: addMinutesToTime(startTime, duration || 30),
      });

      if (available) {
        availableBarbers.push({
          _id: barber._id,
          name: barber.name,
          phoneNumber: barber.phoneNumber,
          averageRating: barber.averageRating,
          totalBookings: barber.totalBookings,
        });
      }
    }

    return availableBarbers;
  } catch (error) {
    logger.error(`Error getting available barbers: ${error.message}`);
    throw error;
  }
};

/**
 * Get next available slot across all barbers
 */
export const getNextAvailableSlot = async ({
  shopId,
  serviceId,
  startDate = new Date(),
  daysAhead = 7,
}) => {
  try {
    const service = await Service.findOne({ _id: serviceId, shop: shopId });
    if (!service) throw new Error('Service not found');

    const shop = await Shop.findById(shopId);
    const maxDaysAhead = shop.settings?.maxDaysInAdvance || 30;
    const checkDays = Math.min(daysAhead, maxDaysAhead);

    for (let i = 0; i < checkDays; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(checkDate.getDate() + i);

      const slots = await getAvailableSlots({
        shopId,
        barberId: service.barbers[0], // Try first barber
        serviceId,
        bookingDate: checkDate,
      });

      if (slots.length > 0) {
        const firstAvailable = slots.find(s => s.available);
        if (firstAvailable) {
          return {
            date: checkDate.toISOString().split('T')[0],
            startTime: firstAvailable.startTime,
            endTime: firstAvailable.endTime,
          };
        }
      }
    }

    return null; // No available slot found
  } catch (error) {
    logger.error(`Error getting next available slot: ${error.message}`);
    throw error;
  }
};

// Helper functions

/**
 * Convert minutes since midnight to HH:MM format
 */
function minutesToTimeString(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Get day name from date (lowercase)
 */
function getDayName(date) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

/**
 * Add minutes to a time string (HH:MM format)
 */
function addMinutesToTime(timeString, minutes) {
  const [hours, mins] = timeString.split(':').map(Number);
  let totalMinutes = hours * 60 + mins + minutes;

  // Handle day overflow
  if (totalMinutes >= 24 * 60) {
    totalMinutes -= 24 * 60;
  }

  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}
