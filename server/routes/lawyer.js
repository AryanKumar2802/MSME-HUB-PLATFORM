import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all lawyers
router.get('/', async (req, res) => {
  try {
    const lawyers = await User.find({ role: 'lawyer' })
      .select('-password');
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single lawyer
router.get('/:id', async (req, res) => {
  try {
    const lawyer = await User.findOne({ 
      _id: req.params.id, 
      role: 'lawyer' 
    }).select('-password');

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;