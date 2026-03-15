import morgan from "morgan";
import { logger } from "../utils/logger";
import { Request } from "express";

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

morgan.token("params", (req) => JSON.stringify((req as Request).params));
morgan.token("query", (req) => JSON.stringify((req as Request).query));

export const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :params :query",
  { stream }
);