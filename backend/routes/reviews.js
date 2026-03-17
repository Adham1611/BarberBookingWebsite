import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/barber/:barberId', reviewController.getBarberReviews);
router.post('/', authenticateToken, authorize('customer', 'admin'), reviewController.createReview);

export default router;
