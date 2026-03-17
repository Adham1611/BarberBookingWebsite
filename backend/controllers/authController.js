import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import logger from '../utils/logger.js';

import Shop from '../models/Shop.js';
import Subscription from '../models/Subscription.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      phone,
    });

    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });

    logger.info(`New user registered: ${user.email}`);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });

    logger.info(`User logged in: ${user.email}`);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.json({ message: 'Logged out successfully' });
    logger.info(`User logged out: ${req.user.email}`);
  } catch (error) {
    next(error);
  }
};

// Register as shop owner (with first shop setup)
export const registerOwner = async (req, res, next) => {
  try {
    const { name, email, password, phone, shopName, shopSlug } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    if (!shopName || !shopSlug) {
      return res.status(400).json({ message: 'Shop name and slug required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Check if shop slug exists
    const existingShop = await Shop.findOne({ slug: shopSlug });
    if (existingShop) {
      return res.status(400).json({ message: 'Shop slug already taken' });
    }

    // Create user with owner role
    user = new User({
      name,
      email,
      password,
      phone,
      role: 'owner',
    });

    // Create shop
    const shop = new Shop({
      name: shopName,
      slug: shopSlug,
      owner: user._id,
    });

    // Set default working hours
    const defaultHours = { open: '09:00', close: '18:00', isClosed: false };
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
      shop.workingHours[day] = defaultHours;
    });
    shop.workingHours.saturday = { open: '10:00', close: '17:00', isClosed: false };
    shop.workingHours.sunday = { open: '', close: '', isClosed: true };

    // Create free subscription
    const subscription = new Subscription({
      shop: shop._id,
      plan: 'free',
      status: 'active',
    });

    // Save all
    await user.save();
    await shop.save();
    await subscription.save();

    // Link subscription to shop
    shop.subscription = subscription._id;
    await shop.save();

    // Add shop to user
    user.shops.push(shop._id);
    user.primaryShop = shop._id;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    logger.info(`New owner registered: ${user.email}, shop: ${shop._id}`);

    res.status(201).json({
      message: 'Owner registered successfully with shop created',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        primaryShop: user.primaryShop,
      },
      shop: {
        id: shop._id,
        name: shop.name,
        slug: shop.slug,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};