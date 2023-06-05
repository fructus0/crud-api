import { UserController } from '../controllers/user.controller';
import { Router } from './router';
import { HttpMethods } from '../constants/http';

const userController = new UserController();

export const userRouter = new Router([
  {
    path: 'api/users',
    method: HttpMethods.GET,
    handler: userController.getAllUsers,
  },
  {
    path: 'api/users/:id',
    method: HttpMethods.GET,
    handler: userController.getUserById,
  },
  {
    path: 'api/users/:id',
    method: HttpMethods.PUT,
    handler: userController.updateUser,
  },
  {
    path: 'api/users/:id',
    method: HttpMethods.DELETE,
    handler: userController.deleteUser,
  },
  {
    path: 'api/users',
    method: HttpMethods.POST,
    handler: userController.createUser,
  },
]);
