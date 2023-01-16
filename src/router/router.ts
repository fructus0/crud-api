import { HttpMethods } from '../constants/http';
import { Request } from './request';
import { Response } from './response';
import { handleException } from '../services/handleException';
import { NotFoundError } from '../errors/notFoundError';

interface ActionHandler {
  path: string;
  method: HttpMethods;
  handler: (request: Request, response: Response) => void;
}

export class Router {
  private readonly actionHandlers: ActionHandler[];

  constructor(actionHandlers: ActionHandler[]) {
    this.actionHandlers = actionHandlers;
  }

  public static convertPathToRegex = (path: string): string => {
    const pathParts = path.split('/');

    const pathRegex = pathParts.map((part) => (part.includes(':') ? '(?<id>.+)' : part)).join('\\/');

    return `^\\/${pathRegex}$`;
  };

  public actionHandler = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    try {
      const actionHandlersWithRegexPath = this.actionHandlers.map((handler) => ({
        ...handler,
        path: Router.convertPathToRegex(handler.path),
      }));

      const actionHandler = actionHandlersWithRegexPath.find(
        (handler) => {
          const urlMatch = request.url?.replace(/\/$/, '');

          const matches = new RegExp(handler.path).exec(urlMatch!);

          return matches && handler.method === request.method;
        },
      );

      if (!actionHandler) {
        throw new NotFoundError('Route not found.');
      }

      if (actionHandler) {
        const body = await Request.resolveBody(request);

        request.setBody(body);

        await actionHandler.handler(request, response);
      }
    } catch (error) {
      handleException(response, error as Error);
    }
  };
}
