import { Router } from 'express';
import * as usersHandlers from './users.handlers';
import { UserLogin, User, UserWithId } from './users.models';
import { validateRequest } from '../../middlewares';

const router = Router();

router.post(
  '/login',
  validateRequest({
    body: UserLogin,
  }),
  usersHandlers.login,
);

router.post(
  '/register',
  validateRequest({
    body: User,
  }),
  usersHandlers.register,
);

router.put(
  '/update-user-data',
  validateRequest({
    body: UserWithId,
  }),
  usersHandlers.updateUserData,
);

export default router;
