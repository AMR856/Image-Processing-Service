import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { loginSchema, registerSchema } from "./user.validation";
import CustomError from "../types/customError";

export class UserController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log(req.body);
      const data = registerSchema.parse(req.body);
      const user = await UserService.register(
        data.username,
        data.password
      );
      res.status(201).json(user);
    } catch (err: any) {
      if (err?.name === "ZodError") {
        return next(new CustomError(err.message, 400));
      }

      next(err instanceof CustomError ? err : new CustomError(err.message));
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await UserService.login(
        data.username,
        data.password
      );
      res.json(result);
    } catch (err: any) {
      if (err?.name === "ZodError") {
        return next(new CustomError(err.message, 400));
      }

      next(
        err instanceof CustomError
          ? err
          : new CustomError(err.message, 401)
      );
    }
  }

  static async profile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // @ts-ignore
      const userId = req.user?.sub;
      const user = await UserService.profile(userId);
      res.json(user);
    } catch (err: any) {
      next(err instanceof CustomError ? err : new CustomError(err.message));
    }
  }
}
