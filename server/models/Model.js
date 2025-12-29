import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
  },
  category: {
    type: String,
    enum: ['bridal', 'casual', 'traditional', 'party', 'kids', 'girls'],
    required: true,
  },
  dressType: {
    type: String,
    enum: ['lehenga', 'saree', 'salwar-kameez', 'gown', 'kurti', 'anarkali', 'other'],
  },
  regions: [{
    name: String,
    coordinates: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
  }],
  dimensions: {
    width: Number,
    height: Number,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Model', modelSchema);