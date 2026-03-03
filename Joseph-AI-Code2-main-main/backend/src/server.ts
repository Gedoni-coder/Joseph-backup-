import express from "express";
import { connnectDB, disconnectDB } from "./config/db.ts";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.ts";

// routes
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import documentRoutes from "./routes/documentRoutes.ts";
import { connectRedis } from "./config/redis.ts";
import { requestLogger } from "./admin/loggingController.ts";

config();
await connnectDB();
await connectRedis();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(requestLogger);
//API Routes
const base = process.env.BASE;
const host = process.env.HOST;
const port = process.env.PORT || 3001;
if (!(host && port && base)) {
  console.error("host port and base env not set");
}
export const mainHost = `${host}:${port}${base}`;
console.log(mainHost);
app.use(`${base}/auth`, authRoutes);
app.use(`${base}/users`, userRoutes);
app.use(`${base}/documents`, documentRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// Gracefully handle shutdown
process.on("unhandledRejection", async (err: Error) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  await disconnectDB();
  process.exit(1);
});
process.on("SIGTERM", async () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  await disconnectDB();
  process.exit(0);
});
process.on("uncaughtException", async (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  await disconnectDB();
  process.exit(1);
});
