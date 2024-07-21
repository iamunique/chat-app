import express from "express";
import compression from "compression";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes";
import GroupRoutes from "./routes/GroupRoutes";
import Database from "./utils/Database";
import errorHandler from "./middleware/ErrorHandler";
import Logger from "./services/Logger";
import dotenv from "dotenv";

dotenv.config();

class App {
  public app: express.Application;
  private logger = Logger.getInstance();

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errorHandling();
    this.connectDatabase();
    this.logger.info(`User created`);
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(compression());
    this.app.use(helmet());
  }

  private routes(): void {
    this.app.use("/api/auth", AuthRoutes);
    this.app.use("/api/users", UserRoutes);
    this.app.use("/api/groups", GroupRoutes);
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }

  private async connectDatabase(): Promise<void> {
    await Database.connect();
  }
}

export default new App().app;
