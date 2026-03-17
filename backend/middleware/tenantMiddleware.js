import Shop from '../models/Shop.js';

export const getTenantFromRequest = async (req) => {
  try {
    let shopId = null;

    if (req.params.shopSlug) {
      const shop = await Shop.findOne({ slug: req.params.shopSlug });
      shopId = shop?._id;
    } else if (req.params.shopId) {
      shopId = req.params.shopId;
    } else if (req.user?.primaryShop) {
      shopId = req.user.primaryShop;
    }

    return shopId;
  } catch (error) {
    return null;
  }
};

export const ensureTenantAccess = async (req, res, next) => {
  try {
    const shopId = await getTenantFromRequest(req);

    if (!shopId) {
      return res.status(400).json({ message: 'Shop ID is required' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Check if user has access to this shop
    if (req.user.role !== 'admin') {
      if (
        req.user.role === 'owner' &&
        shop.owner.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: 'You do not have access to this shop' });
      }

      if (req.user.role === 'barber' && !req.user.shops.some(s => s.toString() === shopId.toString())) {
        return res.status(403).json({ message: 'You do not have access to this shop' });
      }
    }

    req.shop = shop;
    req.shopId = shopId;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Tenant validation error', error: error.message });
  }
};

export const ownerOnly = (req, res, next) => {
  if (req.user.role === 'owner' && req.shop.owner.toString() === req.user.id) {
    return next();
  }
  if (req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Only shop owners can access this resource' });
};

export const barberOrOwner = (req, res, next) => {
  if (req.user.role === 'barber' && req.user.shops.some(s => s.toString() === req.shopId.toString())) {
    return next();
  }
  if (req.user.role === 'owner' && req.shop.owner.toString() === req.user.id) {
    return next();
  }
  if (req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'You do not have permission to access this resource' });
};
