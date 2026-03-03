import { getTransformKey, redis } from "../cache/redis";
import cloudinary from "../config/cloudinary";
import CustomError from "../types/customError";
import { publishTransformJob } from "../utils/rabbitmq";

export class ImageService {
  static async uploadImage(file: Express.Multer.File, userId: number) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `images/${userId}` },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(file.buffer);
    });
  }

  static async getImage(publicId: string) {
    if (!publicId) {
      throw new CustomError("Image publicId is required", 400);
    }

    return cloudinary.url(publicId);
  }

  static async transform(transformations: any, id: string): Promise<string> {
    if (!id) throw new Error("Image id is required");

    const cacheKey = getTransformKey(id, transformations);
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const t: any[] = [];

    if (transformations.resize) {
      t.push({
        crop: "fill",
        width: Number(transformations.resize.width),
        height: Number(transformations.resize.height),
      });
    }

    if (transformations.rotate) {
      t.push({ angle: Number(transformations.rotate) });
    }

    if (transformations.filters?.grayscale) {
      t.push({ effect: "grayscale" });
    }

    if (transformations.filters?.sepia) {
      t.push({ effect: "sepia" });
    }

    const url = cloudinary.url(id, {
      transformation: t,
      format: transformations.format,
      secure: true,
    });

    await redis.set(cacheKey, url);

    publishTransformJob({ imageId: id, transformations, url });

    return url;
  }
}
