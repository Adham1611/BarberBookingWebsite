import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';
import { authenticateToken } from '../middleware/auth.js';
import { ensureTenantAccess, ownerOnly } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// Public routes
// Get all subscription plans
router.get('/plans/all', subscriptionController.getPlans);

// Protected routes
// Get subscription details for shop
router.get('/:shopId/details', authenticateToken, ensureTenantAccess, subscriptionController.getSubscriptionDetails);

// Check if feature limit reached
router.get('/:shopId/check-limit', authenticateToken, ensureTenantAccess, subscriptionController.checkFeatureLimit);

// Pause subscription
router.post('/:shopId/pause', authenticateToken, ensureTenantAccess, ownerOnly, subscriptionController.pauseSubscription);

// Resume subscription
router.post('/:shopId/resume', authenticateToken, ensureTenantAccess, ownerOnly, subscriptionController.resumeSubscription);

// Cancel subscription
router.post('/:shopId/cancel', authenticateToken, ensureTenantAccess, ownerOnly, subscriptionController.cancelSubscription);

// Admin routes
// Get all subscriptions
router.get('/admin/all', authenticateToken, subscriptionController.getSubscriptions);

// Get subscription analytics
router.get('/admin/analytics', authenticateToken, subscriptionController.getSubscriptionAnalytics);

export default router;
