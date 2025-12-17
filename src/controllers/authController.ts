import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { registerSchema } from '../utils/validation';

export const register = async (req: Request, res: Response) => {
  
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).json({ error: 'Email already exists' });

  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({ userId: savedUser._id, email: savedUser.email });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: 'Email not found' });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({ error: 'Invalid password' });

  // Create Token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  res.header('auth-token', token).json({ token });
};