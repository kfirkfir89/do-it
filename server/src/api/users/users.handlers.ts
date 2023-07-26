import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import {
  UserLogin, UserWithId, Users, User,
} from './users.models';

export async function register(req: Request<User>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const insertResult = await Users.insertOne(req.body);
    if (!insertResult.acknowledged) throw Error('Error inserting todo.');
    res.status(201);
    res.json({ _id: insertResult.insertedId, ...req.body });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request<UserLogin>, res: Response<User>, next: NextFunction) {
  try {
    const result = await Users.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!result) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateUserData(req: Request<{}, UserWithId>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const { _id, ...updates } = req.body;
    const result = await Users.findOneAndUpdate({
      _id: new ObjectId(_id),
    }, {
      $set: updates,
    }, {
      returnDocument: 'after',
    });
    if (!result.value) {
      res.status(404);
      throw new Error(`Todo with id ${req.body._id} not found`);
    }
    res.status(200);
    res.json(result.value);
  } catch (error) {
    next(error);
  }
}
