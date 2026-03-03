import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import userRouter from "./modules/users/user.route";
// import imageRouter from './modules/images/image.route';
import { errorHandler } from "./utils/errorHandler";

const allowedOrigins = ["http://localhost:3000"];
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/users", userRouter);
// app.use("/images", imageRouter);

app.use(errorHandler);

export default app;