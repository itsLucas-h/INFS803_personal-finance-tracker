import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface AuthPayload {
  id: number;
  email: string;
}

export const protect: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;

    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Invalid JWT:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
