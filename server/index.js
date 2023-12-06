import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRouter, userRouter, listingRouter } from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((err) => console.log(err));

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error.";
  res.json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port} => http://localhost:${port}/`);
});
