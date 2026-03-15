import logger from '../utils/logger.js';

export const notFound = (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
};

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 403;
    message = 'Invalid token';
  }

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};