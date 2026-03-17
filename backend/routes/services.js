import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.post('/', authenticateToken, authorize('admin'), serviceController.createService);
router.put('/:id', authenticateToken, authorize('admin'), serviceController.updateService);
router.delete('/:id', authenticateToken, authorize('admin'), serviceController.deleteService);

export default router;
