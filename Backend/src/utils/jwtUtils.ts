// src/utils/jwt.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  id: string;
  role: string;
}

// Function to generate a token
export const generateToken = (id: Types.ObjectId, role: string): string => {
  const payload = { id, role };
  
  // Ensure secret exists
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRE || '7d' as any,
  };

  return jwt.sign(payload, secret, options);
};

// Function to verify a token
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  return jwt.verify(token, secret) as JwtPayload;
};
