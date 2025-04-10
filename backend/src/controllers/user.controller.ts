import { Controller } from '../types/express/request.js';

export const getMe: Controller = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
