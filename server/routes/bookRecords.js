import express from 'express';
import BookRecord from '../models/BookRecord.js';
import Business from '../models/Business.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create book record
router.post('/', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    const record = await BookRecord.create({
      business: business._id,
      ...req.body
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all records for user's business
router.get('/', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    const { type, startDate, endDate } = req.query;
    const query = { business: business._id };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await BookRecord.find(query).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get summary statistics
router.get('/summary', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    const income = await BookRecord.aggregate([
      { $match: { business: business._id, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expense = await BookRecord.aggregate([
      { $match: { business: business._id, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalIncome: income[0]?.total || 0,
      totalExpense: expense[0]?.total || 0,
      profit: (income[0]?.total || 0) - (expense[0]?.total || 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update record
router.put('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const record = await BookRecord.findOneAndUpdate(
      { _id: req.params.id, business: business._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete record
router.delete('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const record = await BookRecord.findOneAndDelete({
      _id: req.params.id,
      business: business._id
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;