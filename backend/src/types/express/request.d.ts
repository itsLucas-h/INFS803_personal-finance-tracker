import { Request, Response, NextFunction } from 'express';

export type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>;

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
