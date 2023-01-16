import { UserDto } from '../entities/user/userDto';

interface WorkerMessageData {
  userId?: string;
  userDto?: UserDto;
}

export interface WorkerMessage {
  method: string;
  data?: WorkerMessageData;
}
