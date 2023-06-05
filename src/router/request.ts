import { IncomingMessage } from 'http';
import { BadRequestError } from '../errors/badRequestError';

export class Request extends IncomingMessage {
  private body: string | undefined;

  public static getId = (request: Request): string => {
    if (!request.url) {
      return '';
    }

    const splitUrl = request.url.split('/');

    return splitUrl[splitUrl.length - 1];
  };

  public static resolveBody = async (request: Request): Promise<string> => {
    const bodyChunks: Uint8Array[] = [];

    for await (const chunk of request) {
      bodyChunks.push(chunk);
    }

    return Buffer.concat(bodyChunks).toString();
  };

  public setBody = (body: string) => {
    this.body = body;
  };

  public json = (): Record<string, any> => {
    try {
      return JSON.parse(this.body!);
    } catch (error) {
      throw new BadRequestError('Invalid JSON.');
    }
  };
}
