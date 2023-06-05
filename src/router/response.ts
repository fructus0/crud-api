import { IncomingMessage, ServerResponse } from 'http';

export class Response<
    Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request
  > {
  public json(statusCode: number, data?: object): void {
    this.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });

    this.end(JSON.stringify(data));
  }
}
