import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};