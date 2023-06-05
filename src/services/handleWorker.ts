import { Worker } from 'cluster';

import { userStore } from '../store/userStore';
import { WorkerMessage } from '../types/worker';
import { User } from '../entities/user/user';

export const handleWorkerMessage = async (
  message: WorkerMessage,
  worker: Worker,
): Promise<void> => {
  const { data, method } = message;

  let result: User | User[] | void;

  switch (method) {
    case 'getUserById': {
      result = await userStore.getUserById(data?.userId!);

      break;
    }

    case 'getAllUsers': {
      result = await userStore.getAllUsers();

      break;
    }

    case 'updateUser': {
      result = await userStore.updateUser(data?.userId!, data?.userDto!);

      break;
    }

    case 'addUser': {
      result = await userStore.addUser(data?.userDto!);

      break;
    }

    case 'deleteUser': {
      result = await userStore.deleteUser(data?.userId!);

      break;
    }

    default: {
      return;
    }
  }

  worker.send({ method: message.method, data: result });
};
