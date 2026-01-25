import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { loginSchema, registerSchema } from "./user.validation";

export class UserController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await UserService.register(
        data.username,
        data.password
      );

      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (err) {
      next(err);
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

      res.json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async profile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // @ts-ignore
      const userId = req.user.sub;
      const user = await UserService.profile(userId);

      res.json({
        status: "success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}
