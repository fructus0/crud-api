import cluster from 'cluster';
import { pipeline } from 'stream/promises';
import { createServer, request } from 'http';
import { cpus } from 'os';
import { parse } from 'url';
import { Request } from './router/request';
import { Response } from './router/response';
import { userRouter } from './router/userRouter';
import { handleWorkerMessage } from './services/handleWorker';

const cpusCount = cpus().length;

export class App {
  iteration: number;

  constructor() {
    this.iteration = 0;
  }

  public createApplication = () => createServer(
    { IncomingMessage: Request, ServerResponse: Response },
    userRouter.actionHandler,
  );

  public listenApplication = (port: number) => this.createApplication().listen(port);

  private listenMainServer = async (port: number): Promise<void> => {
    console.log(`Main port is ${port}. Wait for workers startup..`);

    Array.from(Array(cpusCount).keys()).forEach(() => {
      const worker = cluster.fork();

      worker.on('message', (message) => {
        handleWorkerMessage(message, worker);
      });
    });

    createServer((req, response) => {
      this.iteration = this.iteration === cpusCount ? 1 : this.iteration + 1;

      const nextPort = port + this.iteration;

      console.log(`Request processing by port ${nextPort}.`);

      const requestOptions = {
        ...parse(req.url!),
        port: nextPort,
        headers: req.headers,
        method: req.method,
      };

      pipeline(req, request(requestOptions, (message) => {
        response.writeHead(message.statusCode!, message.headers);
        message.pipe(response);
      }));
    }).listen(port);
  };

  private listenWorkerServer = (port: number) => {
    const workerId = cluster.worker!.id;
    const workerPort = port + workerId;

    this.listenApplication(workerPort);

    console.log(`Worker ${workerId} on port ${workerPort} is ready`);
  };

  public listenMultiPortApplication = (port: number) => {
    if (cluster.isPrimary) {
      this.listenMainServer(port);
    } else {
      this.listenWorkerServer(port);
    }
  };
}
