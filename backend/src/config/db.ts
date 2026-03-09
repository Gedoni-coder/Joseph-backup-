import {PrismaClient} from "../../prisma/generated/client/client.ts";
import { config } from "dotenv";
import retry from "../utils/retry.ts";
config();

console.log(process.env.NODE_ENV);

const env = process.env.NODE_ENV || "development";
const accelerateUrl = process.env.DATABASE_URL || "";
const prisma = new PrismaClient({ accelerateUrl: accelerateUrl,
  log:
    env === "development"
      ? ["query", "warn", "error"]
      : ["error"],
});
console.log(process.env.NODE_ENV);

const connnectDB = async () => {
  try {
    await retry(async () => {
      await prisma.$connect();
      console.log("Prisma connected");
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.error("Error disconnecting database:", error);
  }
};

export { prisma, connnectDB, disconnectDB };
