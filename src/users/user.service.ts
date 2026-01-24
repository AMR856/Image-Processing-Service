import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./user.model";

export class UserService {
  static async register(username: string, password: string) {
    const existing = await UserModel.findByUsername(username);
    if (existing) {
      throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      password: hashed,
    });

    return { id: user.id, username: user.username };
  }

  static async login(username: string, password: string) {
    const user = await UserModel.findByUsername(username);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return { token };
  }

  static async profile(userId: number) {
    return UserModel.findById(userId);
  }
}
