import Design from '../models/Design.js';
import cloudinary from '../config/cloudinary.js';
import sharp from 'sharp';
import fs from 'fs/promises';

export const getAllDesigns = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const designs = await Design.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Design.countDocuments(query);

    res.json({
      designs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDesign = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageBuffer = await fs.readFile(req.file.path);
    const metadata = await sharp(imageBuffer).metadata();
    
    const hasAlpha = metadata.hasAlpha;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'embroidery-designs',
      resource_type: 'image',
    });

    const design = new Design({
      name: req.body.name || req.file.originalname,
      description: req.body.description,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      category: req.body.category || 'embroidery',
      tags: req.body.tags ? req.body.tags.split(',') : [],
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
      fileSize: req.file.size,
      isTransparent: hasAlpha,
    });

    await design.save();
    await fs.unlink(req.file.path);

    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    if (design.cloudinaryId) {
      await cloudinary.uploader.destroy(design.cloudinaryId);
    }

    await design.deleteOne();
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};