import { Request, Response, NextFunction } from "express";
import { ImageService } from "./image.service";

export class ImageController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new Error("No image uploaded");
      }

      // @ts-ignore
      const userId = req.user.sub;

      const result: any = await ImageService.uploadImage(req.file, userId);

      res.status(201).json({
        status: "success",
        data: {
          id: result.public_id,
          url: result.secure_url,
          format: result.format,
          size: result.bytes,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { publicId } = req.params;

      // @ts-ignore
      const url = await ImageService.getImage(publicId);

      res.json({
        status: "success",
        data: { url },
      });
    } catch (err) {
      next(err);
    }
  }

  static async transform(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      const transformations = req.body.transformations;

      
      const transformedUrl = await ImageService.transform(
        transformations,
        // @ts-ignore
        id
      );
      res.json({
        status: "success",
        data: {
          imageId: id,
          url: transformedUrl,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
