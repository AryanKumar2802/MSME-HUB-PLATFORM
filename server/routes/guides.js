import express from 'express';
import GSTGuide from '../models/GSTGuide.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all guides
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const guides = await GSTGuide.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single guide
router.get('/:id', async (req, res) => {
  try {
    const guide = await GSTGuide.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name profileImage');

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create guide (mentors/lawyers only)
router.post('/', protect, async (req, res) => {
  try {
    const guide = await GSTGuide.create({
      ...req.body,
      author: req.user._id
    });

    res.status(201).json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
