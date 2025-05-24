import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../utils/s3Uploader.js';
import {
  handleFileUpload,
  getPresignedViewUrl,
  getPresignedDownloadUrl,
  getMyFiles,
  deleteFile,
} from '../controllers/file.controller.js';

const router = Router();

router.use(protect);

// Upload a new file
router.post('/', upload.single('file'), handleFileUpload);

// Get all user files (with optional pagination/filtering)
router.get('/', getMyFiles);

// Get a presigned URL to view file inline
router.get('/view', getPresignedViewUrl);

// Get a presigned URL to download file (with "attachment" disposition)
router.get('/download', getPresignedDownloadUrl);

// Delete file by key (query param: ?key=...)
router.delete('/', deleteFile);

export default router;
