import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import Logger from "./Logger";

class UserService {
  private logger = Logger.getInstance();

  public async createUser(username: string, password: string, role: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    this.logger.info(`User created: ${username}`);
    return user;
  }

  public async editUser(id: string, username?: string, role?: "admin" | "user"): Promise<void> {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found.");
    user.username = username || user.username;
    user.role = role || user.role;
    await user.save();
    this.logger.info(`User updated: ${user.username}`);
  }

  public async getUsers(offset: number = 0, limit: number = 10): Promise<IUser[]> {
    const users = await User.find().select("-password").skip(offset).limit(limit).exec();
    return users;
  }
}

export default UserService;
