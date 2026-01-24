import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from "./utils/errorHandler";
import express from "express";
import userRouter from "./users/user.route";
import bodyParser from "body-parser";
const port = process.env.PORT || 5000;
const app = express();

app.use(errorHandler);
app.use(bodyParser.json());
app.use("/users", userRouter);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
// npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts



