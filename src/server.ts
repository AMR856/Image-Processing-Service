import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./queue.ts/rabbitmq";

const port = process.env.PORT || 5000;

async function bootstrap() {
  await connectRabbitMQ();
  app.listen(port, () =>
    console.log(`Server started on http://localhost:${port}`)
  );
}

bootstrap();