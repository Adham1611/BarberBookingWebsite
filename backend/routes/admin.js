import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/bookings', adminController.getAllBookings);
router.delete('/users/:id', adminController.deleteUser);

export default router;
