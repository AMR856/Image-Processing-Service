import { Request, Response, NextFunction } from "express";
import { ImageService } from "./image.service";
import { ImageModel } from "./image.model";
import CustomError from "../../types/customError";
import { HttpStatusText } from "../../types/HTTPStatusText";

export class ImageController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new CustomError("No image uploaded", 400);
      }

      // @ts-ignore
      const userId = Number(req.user.sub);

      if (!userId) {
        throw new CustomError("Unauthorized", 401, HttpStatusText.FAIL);
      }

      const result: any = await ImageService.uploadImage(req.file, userId);

      const image = await ImageModel.create({
        id: result.public_id,
        url: result.secure_url,
        userId,
      });

      res.status(201).json({
        status: HttpStatusText.SUCCESS,
        data: image,
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
        status: HttpStatusText.SUCCESS,
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
        status: HttpStatusText.SUCCESS,
        data: {
          imageId: id,
          url: transformedUrl,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  static async getImages (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      if (page < 1 || limit < 1) {
        throw new CustomError("Invalid pagination parameters", 400, HttpStatusText.FAIL);
      }

      const skip = (page - 1) * limit;

      // @ts-ignore
      const userId = Number(req.user.sub);

      if (!userId) {
        throw new CustomError("Unauthorized", 401, HttpStatusText.FAIL);
      }

      const images = await ImageModel.findByUserIdPaginated(
        userId,
        skip,
        limit
      );

      res.status(200).json({
        status: HttpStatusText.SUCCESS,
        page,
        limit,
        count: images.length,
        data: images,
      });
    } catch (err) {
      next(err);
    }
  };
}
