import express from 'express';
import * as shopController from '../controllers/shopController.js';
import { authenticateToken } from '../middleware/auth.js';
import { ensureTenantAccess, ownerOnly } from '../middleware/tenantMiddleware.js';
import Shop from '../models/Shop.js';

const router = express.Router();

// Public routes
// List all public shops with filtering
router.get('/public', async (req, res, next) => {
  try {
    const { search, city, sort } = req.query;
    let filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (city) {
      filter['address.city'] = city;
    }

    const shops = await Shop.find(filter)
      .select('name slug description address phone email image stats')
      .sort(sort === 'rating' ? { 'stats.averageRating': -1 } : { createdAt: -1 })
      .limit(50);

    res.json(shops);
  } catch (error) {
    next(error);
  }
});

// Get shop by slug (public)
router.get('/public/:shopSlug', async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ slug: req.params.shopSlug, isActive: true })
      .select('name slug description address phone email image stats workingHours')
      .populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    next(error);
  }
});

// Protected routes
// Create shop (new owner registration)
router.post('/', authenticateToken, shopController.createShop);

// Get all my shops (for owner/barber)
router.get('/my-shops', authenticateToken, shopController.getMyShops);

// Tenant-scoped routes (require shop context)
// Get shop details
router.get('/:shopId', authenticateToken, ensureTenantAccess, shopController.getShop);

// Update shop details
router.patch('/:shopId', authenticateToken, ensureTenantAccess, ownerOnly, shopController.updateShop);

// Get shop subscription
router.get('/:shopId/subscription', authenticateToken, ensureTenantAccess, shopController.getSubscription);

// Upgrade subscription
router.post('/:shopId/subscription/upgrade', authenticateToken, ensureTenantAccess, ownerOnly, shopController.upgradeSubscription);

// Get shop statistics
router.get('/:shopId/stats', authenticateToken, ensureTenantAccess, shopController.getShopStats);

// Upload shop image
router.post('/:shopId/image', authenticateToken, ensureTenantAccess, ownerOnly, shopController.uploadShopImage);

export default router;
