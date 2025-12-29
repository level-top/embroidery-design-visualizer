import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['bridal', 'casual', 'traditional', 'party', 'kids', 'girls'],
    required: true,
  },
  dressType: String,
  baseImageUrl: String,
  layers: [{
    name: String,
    type: {
      type: String,
      enum: ['bodice', 'sleeve', 'skirt', 'dupatta', 'border', 'neckline', 'other'],
    },
    maskUrl: String,
    coordinates: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    customizable: {
      color: Boolean,
      texture: Boolean,
      design: Boolean,
    },
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Template', templateSchema);