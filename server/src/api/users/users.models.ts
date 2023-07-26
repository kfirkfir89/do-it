import z from 'zod';
import { ObjectId, WithId } from 'mongodb';
import { db } from '../../db';

export const User = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserWithId = z.object({
  _id: z.string(),
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type User = z.infer<typeof User>;
export type UserWithId = WithId<User>;
export type UserLogin = z.infer<typeof UserLogin>;
export const Users = db.collection<User>('users');
