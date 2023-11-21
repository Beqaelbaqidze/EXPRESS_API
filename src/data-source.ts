import { createConnection, Connection, ConnectionOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export let AppDataSource: Connection;

export const initializeDatabase = async (): Promise<void> => {
  const connectionOptions: ConnectionOptions = {
    type: process.env.DB_TYPE as "mysql" | "mariadb",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === "true" || true,
    logging: process.env.DB_LOGGING === "true" || false,
    entities: [__dirname + "/entities/**/*.ts"],
    migrations: [__dirname + "/migration/**/*.ts"],
  };

  try {
    AppDataSource = await createConnection(connectionOptions);
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};
