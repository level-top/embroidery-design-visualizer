import Model from '../models/Model.js';
import cloudinary from '../config/cloudinary.js';
import sharp from 'sharp';
import fs from 'fs/promises';

export const getAllModels = async (req, res) => {
  try {
    const { category, dressType } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (dressType) query.dressType = dressType;

    const models = await Model.find(query).sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModelById = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageBuffer = await fs.readFile(req.file.path);
    const metadata = await sharp(imageBuffer).metadata();

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'model-images',
      resource_type: 'image',
    });

    const model = new Model({
      name: req.body.name,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      category: req.body.category,
      dressType: req.body.dressType,
      regions: req.body.regions ? JSON.parse(req.body.regions) : [],
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
    });

    await model.save();
    await fs.unlink(req.file.path);

    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    if (req.body.name) model.name = req.body.name;
    if (req.body.category) model.category = req.body.category;
    if (req.body.dressType) model.dressType = req.body.dressType;
    if (req.body.regions) model.regions = JSON.parse(req.body.regions);

    await model.save();
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    if (model.cloudinaryId) {
      await cloudinary.uploader.destroy(model.cloudinaryId);
    }

    await model.deleteOne();
    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};