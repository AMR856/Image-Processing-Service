import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./user.model";
import CustomError from "../types/customError";

export class UserService {
  static async register(username: string, password: string) {
    const existing = await UserModel.findByUsername(username);
    if (existing) {
      throw new CustomError("User already exists", 409);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      password: hashed,
    });

    return {
      id: user.id,
      username: user.username,
    };
  }

  static async login(username: string, password: string) {
    const user = await UserModel.findByUsername(username);
    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new CustomError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return { token };
  }

  static async profile(userId: number) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  }
}

// {
//   "transformations": {
//     "resize": {
//       "width": 800,
//       "height": 600
//     },
//     "crop": {
//       "width": 400,
//       "height": 300,
//       "x": 50,
//       "y": 50
//     },
//     "rotate": 90,
//     "format": "png",
//     "filters": {
//       "grayscale": true,
//       "sepia": false
//     }
//   }
// }