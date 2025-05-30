import { Controller } from '../types/express/request.js';
import { uploadToS3 } from '../utils/s3Uploader.js';
import { generatePresignedUrl } from '../utils/s3Presigner.js';
import { File as FileModel } from '../models/index.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3.js';

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

export const handleFileUpload: Controller = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided.' });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type.' });
    }

    const fileUrl = await uploadToS3(req.file, req.user!.id);
    const key = fileUrl.split('.amazonaws.com/')[1];

    await FileModel.create({
      userId: req.user!.id,
      key,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      message: 'File uploaded successfully.',
      url: fileUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};

export const getPresignedViewUrl: Controller = async (req, res, next) => {
  try {
    const { key } = req.query;
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ message: "Missing or invalid 'key' query parameter" });
    }

    const file = await FileModel.findOne({ where: { key, userId: req.user!.id } });
    if (!file) return res.status(403).json({ message: 'Access denied to this file.' });

    await file.increment('downloadCount');

    const url = await generatePresignedUrl(key, 'inline');
    res.status(200).json({ url });
  } catch (err) {
    console.error('Presigned view URL error:', err);
    next(err);
  }
};

export const getPresignedDownloadUrl: Controller = async (req, res, next) => {
  try {
    const { key } = req.query;
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ message: "Missing or invalid 'key' query parameter" });
    }

    const file = await FileModel.findOne({ where: { key, userId: req.user!.id } });
    if (!file) return res.status(403).json({ message: 'Access denied to this file.' });

    await file.increment('downloadCount');

    const url = await generatePresignedUrl(key, 'attachment');
    res.status(200).json({ url });
  } catch (err) {
    console.error('Presigned download URL error:', err);
    next(err);
  }
};

export const getMyFiles: Controller = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const mimeType = req.query.mimeType as string | undefined;

    const offset = (page - 1) * limit;
    const whereClause: any = { userId };
    if (mimeType) whereClause.mimeType = mimeType;

    const { count, rows } = await FileModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      total: count,
      page,
      pageCount: Math.ceil(count / limit),
      files: rows,
    });
  } catch (error) {
    console.error('Get files error:', error);
    next(error);
  }
};

export const deleteFile: Controller = async (req, res, next) => {
  try {
    const { key } = req.query;
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ message: "Missing or invalid 'key' query parameter" });
    }

    const file = await FileModel.findOne({ where: { key, userId: req.user!.id } });
    if (!file) {
      return res.status(404).json({ message: 'File not found or access denied.' });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      }),
    );

    await file.destroy();

    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (err) {
    console.error('Delete file error:', err);
    next(err);
  }
};
