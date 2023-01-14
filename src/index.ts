import { createServer } from 'http';
import { config } from 'dotenv';
import { Request } from './router/request';
import { Response } from './router/response';
import { userRouter } from './router/userRouter';

config();

createServer(
  { IncomingMessage: Request, ServerResponse: Response },
  userRouter.actionHandler,
).listen(process.env.PUBLISHED_PORT);
