import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../utils/s3Uploader.js';
import {
  handleFileUpload,
  getPresignedFileUrl,
  getMyFiles,
  deleteFile,
} from '../controllers/file.controller.js';

const router = Router();

router.use(protect);

router.post('/', upload.single('file'), handleFileUpload);
router.get('/', getMyFiles);
router.get('/view', getPresignedFileUrl);
router.delete('/', deleteFile);

export default router;
