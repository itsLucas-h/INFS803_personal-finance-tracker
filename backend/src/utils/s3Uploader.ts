import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3.js';
import type { Express } from 'express';

const storage = multer.memoryStorage();

export const upload = multer({ storage });

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
  });

  await s3.send(command);

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
