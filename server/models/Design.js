import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
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
    enum: ['embroidery', 'pattern', 'motif', 'border', 'all-over'],
    default: 'embroidery',
  },
  tags: [String],
  dimensions: {
    width: Number,
    height: Number,
  },
  fileSize: Number,
  isTransparent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Design', designSchema);