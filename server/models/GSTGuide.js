import mongoose from 'mongoose';

const gstGuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Registration', 'Filing', 'Compliance', 'Returns', 'General'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  attachments: [String],
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('GSTGuide', gstGuideSchema);