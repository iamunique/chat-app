import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";

class UserController {
  private userService = new UserService();

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { username, password, role } = req.body;
    try {
      const user = await this.userService.createUser(username, password, role);
      return res.status(201).send({ message: "User created successfully.", data: user });
    } catch (error) {
      return next(error);
    }
  };

  public editUser = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    const { id } = req.params;
    const { username, role } = req.body;
    try {
      await this.userService.editUser(id, username, role);
      return res.send({ message: "User updated successfully." });
    } catch (error) {
      return next(error);
    }
  };

  public getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> => {
    try {
      const users = await this.userService.getUsers();
      return res.send(users);
    } catch (error) {
      return next(error);
    }
  };
}

export default UserController;
