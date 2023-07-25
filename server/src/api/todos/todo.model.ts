import z from 'zod';
import { WithId } from 'mongodb';
import { db } from '../../db';

export const Todo = z.object({
  content: z.string().min(1),
  done: z.boolean().default(false),
});

export type Todo = z.infer<typeof Todo>;
export type TodoWithId = WithId<Todo>;
export const Todos = db.collection<Todo>('todos');
