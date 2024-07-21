import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import Logger from "./Logger";
import { NotFoundError, ConflictError } from "../utils/AppError";

class UserService {
  private logger = Logger.getInstance();

  public async createUser(username: string, password: string, role: string): Promise<IUser> {
    const userExist = await User.countDocuments({ username });
    if (userExist) {
      this.logger.warn(`Create user attempt failed. Username ${username} already exists.`);
      throw new ConflictError("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    this.logger.info(`User created: ${username}`);

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword as IUser;
  }

  public async editUser(id: string, username?: string, role?: "admin" | "user"): Promise<void> {
    const user = await User.findById(id);
    if (!user) {
      this.logger.warn(`Edit user attempt failed. User with id ${id} not found.`);
      throw new NotFoundError("User not found.");
    }

    if (username && (await User.countDocuments({ username }))) {
      this.logger.warn(`Edit user attempt failed. Username ${username} already exists.`);
      throw new ConflictError("Username already exists");
    }

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
