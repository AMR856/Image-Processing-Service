import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { HttpStatusText } from "../../types/HTTPStatusText";
import { AuthInput } from "./user.validation";

export class UserController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.register(
        req.validated!.body as AuthInput
      );

      res.status(201).json({
        status: HttpStatusText.SUCCESS,
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
      const result = await UserService.login(
        req.validated!.body as AuthInput
      );

      res.json({
        status: HttpStatusText.SUCCESS,
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
      console.log(res.locals.user);
      const userId = res.locals.user;
      const user = await UserService.profile(userId);

      res.json({
        status: HttpStatusText.SUCCESS,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}
