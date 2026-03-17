import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { ensureTenantAccess } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// ─── Owner/Barber: Shop-scoped analytics ────────────────────────────────────
router.get('/shops/:shopId/overview',    authenticateToken, ensureTenantAccess, analyticsController.getShopOverview);
router.get('/shops/:shopId/trends',      authenticateToken, ensureTenantAccess, analyticsController.getBookingTrends);
router.get('/shops/:shopId/services',    authenticateToken, ensureTenantAccess, analyticsController.getTopServices);
router.get('/shops/:shopId/barbers',     authenticateToken, ensureTenantAccess, analyticsController.getBarberPerformance);
router.get('/shops/:shopId/revenue',     authenticateToken, ensureTenantAccess, analyticsController.getRevenueByMonth);
router.get('/shops/:shopId/upcoming',    authenticateToken, ensureTenantAccess, analyticsController.getUpcomingBookings);

// ─── Platform Admin analytics ────────────────────────────────────────────────
router.get('/admin/stats',         authenticateToken, authorize('admin'), analyticsController.getPlatformStats);
router.get('/admin/revenue-trend', authenticateToken, authorize('admin'), analyticsController.getPlatformRevenueTrend);
router.get('/admin/shops',         authenticateToken, authorize('admin'), analyticsController.getAdminShopList);
router.patch('/admin/shops/:shopId/toggle', authenticateToken, authorize('admin'), analyticsController.toggleShopStatus);

export default router;
