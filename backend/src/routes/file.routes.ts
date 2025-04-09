import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../utils/s3Uploader';
import {
  handleFileUpload,
  getPresignedFileUrl,
  getMyFiles,
  deleteFile,
} from '../controllers/file.controller';

const router = Router();

router.use(protect);

router.post('/', upload.single('file'), handleFileUpload);
router.get('/', getMyFiles);
router.get('/view', getPresignedFileUrl);
router.delete('/', deleteFile);

export default router;
