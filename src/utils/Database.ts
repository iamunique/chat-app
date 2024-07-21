import mongoose from "mongoose";
import Logger from "../services/Logger";

class Database {
  public static async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI!, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      Logger.getInstance().info("MongoDB connected...");
    } catch (error) {
      console.log(error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      Logger.getInstance().error(`Could not connect to MongoDB: ${errorMessage}`);
    }
  }
}

export default Database;
