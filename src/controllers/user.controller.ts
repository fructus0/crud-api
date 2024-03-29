import { UserStore, userStore } from '../store/userStore';
import { Request } from '../router/request';
import { Response } from '../router/response';
import { UserDto } from '../entities/user/userDto';
import { HttpStatusCodes } from '../constants/http';
import { UserValidator } from '../validators/user.validator';
import { NotFoundError } from '../errors/notFoundError';
import { UserMultiModeStore } from '../store/userMultiModeStore';

export class UserController {
  private userStore: UserStore | UserMultiModeStore;

  constructor() {
    this.userStore = userStore;
  }

  public getAllUsers = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    const users = await this.userStore.getAllUsers();

    response.json(HttpStatusCodes.OK, users);
  };

  public getUserById = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    const userId = Request.getId(request);

    UserValidator.validateUuid(userId);

    const user = await this.userStore.getUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    response.json(HttpStatusCodes.OK, user);
  };

  public updateUser = async (
    request: Request,
    response: Response,
  ) => {
    const userId = Request.getId(request);

    UserValidator.validateUuid(userId);

    const appropriateUser = await this.userStore.getUserById(userId);

    if (!appropriateUser) {
      throw new NotFoundError('User not found.');
    }

    const userDto = request.json();

    UserValidator.validateRequestKeys(userDto);

    UserValidator.validateUserDto(userDto);

    const user = await this.userStore.updateUser(userId, userDto as UserDto);

    response.json(HttpStatusCodes.OK, user);
  };

  public deleteUser = async (
    request: Request,
    response: Response,
  ) => {
    const userId = Request.getId(request);

    UserValidator.validateUuid(userId);

    const appropriateUser = await this.userStore.getUserById(userId);

    if (!appropriateUser) {
      throw new NotFoundError('User not found.');
    }

    this.userStore.deleteUser(userId);

    response.json(HttpStatusCodes.NO_CONTENT);
  };

  public createUser = async (
    request: Request,
    response: Response,
  ) => {
    const userDto = request.json();

    UserValidator.validateRequestKeys(userDto);

    UserValidator.validateUserDto(userDto);

    const addedUser = await this.userStore.addUser(userDto as UserDto);

    response.json(HttpStatusCodes.CREATED, addedUser);
  };
}
