import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  gstNumber: String,
  panNumber: String,
  businessType: {
    type: String,
    enum: ['Manufacturing', 'Trading', 'Service', 'Retail', 'Other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  registrationDate: Date,
  website: String,
  employees: Number,
  annualTurnover: Number,
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);