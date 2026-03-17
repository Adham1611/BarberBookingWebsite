import Shop from '../models/Shop.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// Create a new shop (by owner)
export const createShop = async (req, res, next) => {
  try {
    const { name, slug, description, address, phone, email, website } = req.body;

    // Check if slug is unique
    if (slug) {
      const existingShop = await Shop.findOne({ slug });
      if (existingShop) {
        return res.status(400).json({ message: 'Shop slug already exists' });
      }
    }

    const shop = new Shop({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      owner: req.user.id,
      description,
      address,
      phone,
      email,
      website,
    });

    // Set default working hours (9AM - 6PM)
    const defaultHours = { open: '09:00', close: '18:00', isClosed: false };
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
      shop.workingHours[day] = defaultHours;
    });
    shop.workingHours.saturday = { open: '10:00', close: '17:00', isClosed: false };
    shop.workingHours.sunday = { open: '', close: '', isClosed: true };

    await shop.save();

    // Create free tier subscription
    const subscription = new Subscription({
      shop: shop._id,
      plan: 'free',
      status: 'active',
    });
    await subscription.save();

    shop.subscription = subscription._id;
    await shop.save();

    // Add shop to user's shops
    req.user.shops.push(shop._id);
    req.user.primaryShop = shop._id;
    req.user.role = 'owner';
    await req.user.save();

    logger.info(`Shop created: ${shop._id}`);
    res.status(201).json({ message: 'Shop created successfully', shop });
  } catch (error) {
    logger.error(`Error creating shop: ${error.message}`);
    next(error);
  }
};

// Get shop details
export const getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.shopId)
      .populate('owner', 'name email')
      .populate('subscription');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    next(error);
  }
};

// Get all shops for a user (owner)
export const getMyShops = async (req, res, next) => {
  try {
    let shops;
    if (req.user.role === 'admin') {
      shops = await Shop.find().populate('owner', 'name email');
    } else if (req.user.role === 'owner') {
      shops = await Shop.find({ owner: req.user.id }).populate('subscription');
    } else if (req.user.role === 'barber') {
      shops = await Shop.find({ _id: { $in: req.user.shops } });
    } else {
      shops = [];
    }

    res.json(shops);
  } catch (error) {
    next(error);
  }
};

// Update shop details
export const updateShop = async (req, res, next) => {
  try {
    const { name, description, address, phone, email, website, workingHours, settings } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      req.shopId,
      {
        name,
        description,
        address,
        phone,
        email,
        website,
        workingHours: workingHours || undefined,
        settings: settings || undefined,
      },
      { new: true, runValidators: true }
    );

    logger.info(`Shop updated: ${req.shopId}`);
    res.json({ message: 'Shop updated successfully', shop });
  } catch (error) {
    next(error);
  }
};

// Get shop's subscription
export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ shop: req.shopId });

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

// Upgrade subscription plan
export const upgradeSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;

    const validPlans = ['free', 'starter', 'pro', 'premium'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const subscription = await Subscription.findOneAndUpdate(
      { shop: req.shopId },
      { plan, status: 'active' },
      { new: true }
    );

    logger.info(`Subscription upgraded to ${plan} for shop: ${req.shopId}`);
    res.json({ message: 'Subscription upgraded successfully', subscription });
  } catch (error) {
    next(error);
  }
};

// Get shop statistics
export const getShopStats = async (req, res, next) => {
  try {
    const Shop_data = await Shop.findById(req.shopId);

    if (!Shop_data) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(Shop_data.stats);
  } catch (error) {
    next(error);
  }
};

// Update shop image
export const uploadShopImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // In production, upload to cloud storage (S3, Cloudinary, etc.)
    const imageUrl = `/uploads/${req.file.filename}`;

    const shop = await Shop.findByIdAndUpdate(
      req.shopId,
      { image: imageUrl },
      { new: true }
    );

    res.json({ message: 'Image uploaded successfully', shop });
  } catch (error) {
    next(error);
  }
};
