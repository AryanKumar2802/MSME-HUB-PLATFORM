import mongoose from 'mongoose';

const bookRecordSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  invoiceNumber: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'upi', 'card', 'other']
  },
  attachments: [String]
}, { timestamps: true });

export default mongoose.model('BookRecord', bookRecordSchema);