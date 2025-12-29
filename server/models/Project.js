import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true,
  },
  dressCustomization: {
    color: String,
    clothType: String,
    pattern: String,
  },
  designPlacements: [{
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
    },
    position: {
      x: Number,
      y: Number,
    },
    scale: {
      type: Number,
      default: 1,
    },
    rotation: {
      type: Number,
      default: 0,
    },
    region: String,
    zIndex: Number,
  }],
  finalImage: {
    url: String,
    cloudinaryId: String,
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Project', projectSchema);