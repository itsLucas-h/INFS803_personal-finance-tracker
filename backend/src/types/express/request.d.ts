import { Request, Response, NextFunction } from 'express';

export type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void>;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}
