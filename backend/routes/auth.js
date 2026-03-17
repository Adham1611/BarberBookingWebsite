import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/register/owner', authController.registerOwner);
router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);

export default router;