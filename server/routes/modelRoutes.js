import express from 'express';
import multer from 'multer';
import { 
  getAllModels, 
  getModelById, 
  createModel, 
  updateModel,
  deleteModel 
} from '../controllers/modelController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/models/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get('/', getAllModels);
router.get('/:id', getModelById);
router.post('/', upload.single('image'), createModel);
router.put('/:id', updateModel);
router.delete('/:id', deleteModel);

export default router;