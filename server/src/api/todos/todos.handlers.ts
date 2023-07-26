/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { TodoWithId, Todos, Todo } from './todo.models';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

export async function findAll(req: Request, res: Response<TodoWithId[]>, next: NextFunction) {
  try {
    const todos = await Todos.find().toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export async function findOne(req: Request<ParamsWithId, Todo, {}>, res: Response<TodoWithId>, next: NextFunction) {
  try {
    const result = await Todos.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Todo with id ${req.params.id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, TodoWithId, Todo>, res: Response<TodoWithId>, next: NextFunction) {
  try {
    const insertResult = await Todos.insertOne(req.body);
    if (!insertResult.acknowledged) throw Error('Error inserting todo.');
    res.status(201);
    res.json({ _id: insertResult.insertedId, ...req.body });
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, TodoWithId, Todo>, res: Response<TodoWithId>, next: NextFunction) {
  try {
    const result = await Todos.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (!result.value) {
      res.status(404);
      throw new Error(`Todo with id ${req.params.id} not found`);
    }
    res.status(200);
    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Todos.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (!result.value) {
      res.status(404);
      throw new Error(`Todo with id ${req.params.id} not found`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
