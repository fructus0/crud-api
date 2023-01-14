import { User } from '../entities/user/user';
import { UserDto } from '../entities/user/userDto';

export class UserStore {
  private users: User[] = [
    new User('Aleksey', 13, ['play computer games']),
  ];

  public getUserById = (
    id: string,
  ): User | undefined => this.users.find((user) => user.getId() === id);

  public getAllUsers = (): User[] => this.users;

  public updateUser = (userId: string, userDto: UserDto): User => {
    const updatedUser = new User(
      userDto.username,
      userDto.age,
      userDto.hobbies,
      userId,
    );

    this.users = this.users.map((user) => (user.getId() === userId ? updatedUser : user));

    return updatedUser;
  };

  public addUser = (userDto: UserDto): User => {
    const createdUser = new User(
      userDto.username,
      userDto.age,
      userDto.hobbies,
    );

    this.users.push(createdUser);

    return createdUser;
  };

  public deleteUser = (userId: string): void => {
    this.users = this.users.filter((user) => user.getId() !== userId);
  };
}
