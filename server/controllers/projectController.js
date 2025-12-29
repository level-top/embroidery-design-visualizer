import Project from '../models/Project.js';
import Model from '../models/Model.js';
import Design from '../models/Design.js';
import cloudinary from '../config/cloudinary.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('modelId')
      .populate('designPlacements.designId')
      .sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('modelId')
      .populate('designPlacements.designId');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description, modelId, dressCustomization } = req.body;

    const modelExists = await Model.findById(modelId);
    if (!modelExists) {
      return res.status(404).json({ message: 'Model not found' });
    }

    const project = new Project({
      name,
      description,
      modelId,
      dressCustomization,
      designPlacements: [],
    });

    await project.save();
    await project.populate('modelId');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { name, description, dressCustomization, designPlacements, status } = req.body;

    if (name) project.name = name;
    if (description) project.description = description;
    if (dressCustomization) project.dressCustomization = dressCustomization;
    if (designPlacements) project.designPlacements = designPlacements;
    if (status) project.status = status;

    await project.save();
    await project.populate(['modelId', 'designPlacements.designId']);
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { imageDataUrl } = req.body;
    
    const result = await cloudinary.uploader.upload(imageDataUrl, {
      folder: 'project-exports',
    });

    project.finalImage = {
      url: result.secure_url,
      cloudinaryId: result.public_id,
    };
    project.status = 'completed';

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};