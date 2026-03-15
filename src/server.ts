import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectRabbitMQ } from "./queue/rabbitmq";

const port = process.env.PORT || 5000;

async function bootstrap() {
  await connectRabbitMQ();

  const server = app.listen(port, () =>
    console.log(`Server started on http://localhost:${port}`)
  );

  const shutdown = (signal: string) => {
    console.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Could not close connections in time, forcing shutdown");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});