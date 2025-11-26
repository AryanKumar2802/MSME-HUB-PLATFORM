import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all mentors/lawyers
router.get('/users', protect, async (req, res) => {
  try {
    const { role } = req.query;
    const query = { _id: { $ne: req.user._id } };
    
    if (role) query.role = role;

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat list
router.get('/list', protect, async (req, res) => {
  try {
    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$chatId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiver', req.user._id] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Populate user details
    const populatedChats = await Message.populate(chats, {
      path: 'lastMessage.sender lastMessage.receiver',
      select: 'name email profileImage role'
    });

    res.json(populatedChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between two users
router.get('/messages/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const chatId = [req.user._id, userId].sort().join('-');

    const messages = await Message.find({ chatId })
      .populate('sender receiver', 'name profileImage')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { chatId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/messages', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const chatId = [req.user._id, receiverId].sort().join('-');

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      chatId
    });

    const populatedMessage = await message.populate('sender receiver', 'name profileImage');
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;