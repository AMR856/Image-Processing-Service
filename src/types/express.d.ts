import { Request } from "express";

import { ZodTypeAny } from "zod";

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: ZodTypeAny["_input"];
        params?: ZodTypeAny["_input"];
        query?: ZodTypeAny["_input"];
      };
    }
  }
}
