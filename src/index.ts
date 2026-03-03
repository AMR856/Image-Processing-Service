import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from "./utils/errorHandler";
import express from "express";
import bodyParser from "body-parser";
import userRouter from './modules/users/user.route';
// import imageRouter from './modules/images/image.route';
import { connectRabbitMQ } from './queue.ts/rabbitmq';

const port = process.env.PORT || 5000;
const app = express();

app.use(errorHandler);
app.use(bodyParser.json());
app.use("/users", userRouter);
// app.use('/images', imageRouter);

bootstrap();

// npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts

async function bootstrap() {
  await connectRabbitMQ();
  app.listen(port, () =>
    console.log(`Server started on http://localhost:${port}`)
  );
}

