import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Logger from "./Logger";
import User from "../models/User";
import { BadRequestError, UnauthorizedError } from "../utils/AppError";

class AuthService {
  private logger = Logger.getInstance();

  public async register(username: string, password: string): Promise<void> {
    if ((await User.countDocuments({ role: "admin" })) > 0) {
      throw new BadRequestError("For Initial Admin Creation Only");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: "admin" });
    await user.save();
    this.logger.info(`User registered: ${username}`);
  }

  public async login(username: string, password: string): Promise<string> {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Invalid username or password.");
    }
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    this.logger.info(`User logged in: ${username}`);
    return token;
  }
}

export default AuthService;
