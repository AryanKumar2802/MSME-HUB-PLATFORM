import express from 'express';
import Business from '../models/Business.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Create business profile
router.post('/', protect, restrictTo('business'), async (req, res) => {
  try {
    const business = await Business.create({
      owner: req.user._id,
      ...req.body
    });
    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's business
router.get('/my-business', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update business
router.put('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload business document
router.post('/:id/documents', protect, upload.single('document'), async (req, res) => {
  try {
    const business = await Business.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    business.documents.push({
      name: req.body.name || req.file.originalname,
      url: req.file.path
    });

    await business.save();
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;