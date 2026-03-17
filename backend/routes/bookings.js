import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { ensureTenantAccess } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// Public endpoints (no auth required for walk-in bookings)
// Get available slots for a barber
router.get('/:shopId/available-slots', bookingController.getAvailableSlotsController);

// Get available barbers for a service
router.get('/:shopId/available-barbers', bookingController.getAvailableBarbersController);

// Protected endpoints (require auth and shop access)
// Create booking
router.post('/:shopId', authenticateToken, ensureTenantAccess, bookingController.createBooking);

// Get all bookings for shop (barber/owner) or customer's bookings
router.get('/:shopId', authenticateToken, ensureTenantAccess, bookingController.getBookings);

// Cancel booking
router.patch('/:shopId/bookings/:id/cancel', authenticateToken, ensureTenantAccess, bookingController.cancelBooking);

export default router;
