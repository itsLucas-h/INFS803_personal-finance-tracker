import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: result.error.format(),
      });
      return;
    }

    req.body = result.data;
    next();
  };
};
