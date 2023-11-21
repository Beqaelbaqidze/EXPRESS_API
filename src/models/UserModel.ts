import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class UserModel {
  static async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User | undefined> {
    try {
      const user = new User();
      user.username = username;
      user.email = email;
      user.password = password;

      await AppDataSource.manager.save(user);

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async findUserById(id: number): Promise<User | undefined> {
    try {
      const user = await AppDataSource.manager.findOne(User, id);
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }
}
