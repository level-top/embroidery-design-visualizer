import express from 'express';
import multer from 'multer';
import { 
  getAllDesigns, 
  getDesignById, 
  createDesign, 
  deleteDesign 
} from '../controllers/designController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/designs/');
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

router.get('/', getAllDesigns);
router.get('/:id', getDesignById);
router.post('/', upload.single('image'), createDesign);
router.delete('/:id', deleteDesign);

export default router;