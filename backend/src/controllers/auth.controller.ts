import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required.' });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Email already in use.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = newUser.get({ plain: true }) as any;
    delete userWithoutPassword.password;

    res.status(201).json({
      message: 'User registered successfully.',
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    next(err);
  }
};
