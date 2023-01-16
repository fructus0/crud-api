import { v4 as uuidv4 } from 'uuid';

export class User {
  private readonly id: string;

  private username: string;

  private age: number;

  private hobbies: string[];

  constructor(username: string, age: number, hobbies: string[], id: string = uuidv4()) {
    this.id = id;
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }

  public getId(): string {
    return this.id;
  }
}
