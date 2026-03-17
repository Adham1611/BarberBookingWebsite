import Customer from '../models/Customer.js';
import Shop from '../models/Shop.js';
import logger from '../utils/logger.js';

// Create a new customer in shop
export const createCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, birthday, gender, address, notes, tags } = req.body;

    // Check if customer with same phone/email already exists in shop
    if (email || phone) {
      const existingCustomer = await Customer.findOne({
        shop: req.shopId,
        $or: [
          email && { email },
          phone && { phone },
        ],
      });

      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email or phone already exists' });
      }
    }

    const customer = new Customer({
      shop: req.shopId,
      firstName,
      lastName,
      email,
      phone,
      birthday,
      gender,
      address,
      notes,
      tags: tags || [],
    });

    await customer.save();

    logger.info(`Customer created: ${customer._id}`);
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    logger.error(`Error creating customer: ${error.message}`);
    next(error);
  }
};

// Get all customers for a shop
export const getCustomers = async (req, res, next) => {
  try {
    const { search, sort, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let filter = { shop: req.shopId };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(filter)
      .sort(sort === 'recent' ? { lastBookingDate: -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Customer.countDocuments(filter);

    res.json({
      customers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get customer details
export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.customerId,
      shop: req.shopId,
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

// Update customer details
export const updateCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, birthday, gender, address, notes, tags } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.customerId, shop: req.shopId },
      {
        firstName,
        lastName,
        email,
        phone,
        birthday,
        gender,
        address,
        notes,
        tags,
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    logger.info(`Customer updated: ${req.params.customerId}`);
    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    next(error);
  }
};

// Delete customer
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.customerId,
      shop: req.shopId,
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    logger.info(`Customer deleted: ${req.params.customerId}`);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Add loyalty points
export const addLoyaltyPoints = async (req, res, next) => {
  try {
    const { points, reason } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    logger.info(`Loyalty points added to customer: ${req.params.customerId}`);
    res.json({ message: 'Loyalty points updated', customer });
  } catch (error) {
    next(error);
  }
};

// Add tag to customer
export const addTag = async (req, res, next) => {
  try {
    const { tag } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      { $addToSet: { tags: tag } },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Tag added', customer });
  } catch (error) {
    next(error);
  }
};

// Remove tag from customer
export const removeTag = async (req, res, next) => {
  try {
    const { tag } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      { $pull: { tags: tag } },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Tag removed', customer });
  } catch (error) {
    next(error);
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res, next) => {
  try {
    const totalCustomers = await Customer.countDocuments({ shop: req.shopId });

    const newThisMonth = await Customer.countDocuments({
      shop: req.shopId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    const loyaltyStats = await Customer.aggregate([
      { $match: { shop: req.shopId } },
      {
        $group: {
          _id: null,
          totalPointsIssued: { $sum: '$loyaltyPoints' },
          avgPointsPerCustomer: { $avg: '$loyaltyPoints' },
          maxPoints: { $max: '$loyaltyPoints' },
        },
      },
    ]);

    res.json({
      totalCustomers,
      newThisMonth,
      loyaltyStats: loyaltyStats[0] || {},
    });
  } catch (error) {
    next(error);
  }
};
