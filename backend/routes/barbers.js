import express from 'express';
import * as barberController from '../controllers/barberController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', barberController.getAllBarbers);
router.get('/:id', barberController.getBarberById);
router.post('/', authenticateToken, authorize('barber', 'admin'), barberController.createBarber);
router.put('/:id', authenticateToken, authorize('barber', 'admin'), barberController.updateBarber);

export default router;
