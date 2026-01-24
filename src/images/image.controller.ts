import { Request, Response } from "express";
import { ImageService } from "./image.service";
import cloudinary from "../config/cloudinary";
import { env } from "node:process";

export class ImageController {
  static async upload(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    // @ts-ignore
    const userId = req.user!.sub;

    const result: any = await ImageService.uploadImage(req.file, userId);

    res.status(201).json({
      id: result.public_id,
      url: result.secure_url,
      format: result.format,
      size: result.bytes,
    });
  }

  static async get(req: Request, res: Response) {
    const { publicId } = req.params;

    const url = await ImageService.getImage(publicId as string);
    res.json({ url });
  }
}
