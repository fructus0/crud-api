import cluster from 'cluster';
import { User } from '../entities/user/user';
import { UserDto } from '../entities/user/userDto';
import { WorkerMessage } from '../types/worker';

export class UserMultiModeStore {
  public getUserById = async (userId: string): Promise<User> => this.transferContextToMainPort(
    {
      method: 'getUserById',
      data: {
        userId,
      },
    },
  );

  public getAllUsers = async (): Promise<User[]> => this.transferContextToMainPort({
    method: 'getAllUsers',
  });

  public updateUser = async (
    userId: string,
    userDto: UserDto,
  ): Promise<User> => this.transferContextToMainPort(
    {
      method: 'updateUser',
      data: {
        userId,
        userDto,
      },
    },
  );

  public addUser = async (userDto: UserDto): Promise<User> => this.transferContextToMainPort({
    method: 'addUser',
    data: {
      userDto,
    },
  });

  public deleteUser = async (userId: string): Promise<void> => {
    await this.transferContextToMainPort({
      method: 'deleteUser',
      data: {
        userId,
      },
    });
  };

  private async transferContextToMainPort(workerMessage: WorkerMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      process.send!(workerMessage);

      cluster.worker!.once('message', (message) => {
        if (message.method === workerMessage.method) {
          resolve(message.data);
        } else {
          reject(message);
        }
      });
    });
  }
}
