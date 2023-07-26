import express from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import todos from './todos/todo.routes';
import users from './users/users.routes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/', users);
router.use('/todos', todos);

export default router;
