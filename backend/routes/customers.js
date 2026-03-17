import express from 'express';
import * as customerController from '../controllers/customerController.js';
import { authenticateToken } from '../middleware/auth.js';
import { ensureTenantAccess } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// All routes require authentication and tenant access
router.use(authenticateToken);
router.use('/:shopId', ensureTenantAccess);

// Create customer
router.post('/:shopId', customerController.createCustomer);

// Get all customers for shop
router.get('/:shopId', customerController.getCustomers);

// Get customer statistics
router.get('/:shopId/stats', customerController.getCustomerStats);

// Get customer details
router.get('/:shopId/customers/:customerId', customerController.getCustomer);

// Update customer
router.patch('/:shopId/customers/:customerId', customerController.updateCustomer);

// Delete customer
router.delete('/:shopId/customers/:customerId', customerController.deleteCustomer);

// Add loyalty points
router.post('/:shopId/customers/:customerId/loyalty', customerController.addLoyaltyPoints);

// Add tag
router.post('/:shopId/customers/:customerId/tags', customerController.addTag);

// Remove tag
router.delete('/:shopId/customers/:customerId/tags', customerController.removeTag);

export default router;
