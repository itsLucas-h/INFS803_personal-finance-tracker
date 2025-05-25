import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3.js';
import type { Express } from 'express';

// In-memory file storage
const storage = multer.memoryStorage();

// Multer middleware for handling multipart/form-data
export const upload = multer({ storage });

/**
 * Generates a unique S3 object key for a user's uploaded file.
 * Format: userId/timestamp-uuid.extension
 */
const generateS3Key = (userId: number, originalName: string): string => {
  const fileExt = path.extname(originalName);
  const uniqueName = `${Date.now()}-${randomUUID()}${fileExt}`;
  return `${userId}/${uniqueName}`;
};

export const uploadToS3 = async (file: Express.Multer.File, userId: number): Promise<string> => {
  const key = generateS3Key(userId, file.originalname);

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private',
  });

  await s3.send(command);

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
