import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await AppDataSource.manager.findOne(User, {
      where: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400)
    }


    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    await AppDataSource.manager.save(newUser);

    res.status(201);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500)
  }
};
