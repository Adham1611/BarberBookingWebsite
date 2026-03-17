import express from 'express';
import * as slotController from '../controllers/slotController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', slotController.getAvailableSlots);
router.post('/', authenticateToken, authorize('barber', 'admin'), slotController.createSlot);

export default router;