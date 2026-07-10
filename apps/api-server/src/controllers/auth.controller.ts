import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/postgres';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-prod';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
      }

      // Check if user exists
      const checkResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (checkResult.rows.length > 0) {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user
      const insertResult = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [name, email, hashedPassword]
      );
      const userId = insertResult.rows[0].id;

      // Generate JWT
      const token = jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '7d' });

      // Set cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({ user: { id: userId, name, email } });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Find user
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

      // Set cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.cookie('jwt', '', {
      httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0) // Expire immediately
    });
    res.status(200).json({ message: 'Logged out successfully' });
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.userId]);
      const user = result.rows[0];

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ user });
    } catch (error: any) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}
