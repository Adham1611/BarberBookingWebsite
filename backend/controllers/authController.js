import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import logger from '../utils/logger.js';

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