import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../config/s3.js';

export const generatePresignedUrl = async (
  key: string,
  disposition: 'inline' | 'attachment' = 'inline',
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ResponseContentDisposition: `${disposition}; filename="${key}"`,
  });

  return await getSignedUrl(s3, command, { expiresIn: 900 });
};
