import { createServer } from 'http';
import { config } from 'dotenv';
import { UserController } from './controllers/user.controller';
import { Router } from './router/router';
import { HttpMethods } from './constants/http';
import { Request } from './router/request';
import { Response } from './router/response';

config();

const userController = new UserController();

const userRouter = new Router([
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

createServer(
  { IncomingMessage: Request, ServerResponse: Response },
  userRouter.actionHandler,
).listen(process.env.PUBLISHED_PORT);
