import express from 'express';
import { 
  getAllProjects, 
  getProjectById, 
  createProject, 
  updateProject,
  deleteProject,
  saveProjectImage
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/save-image', saveProjectImage);

export default router;