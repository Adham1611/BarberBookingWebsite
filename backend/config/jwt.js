import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return process.env.JWT_SECRET;
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '30d' });
};