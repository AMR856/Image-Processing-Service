import { getTransformKey, redis } from "../../cache/redis";
import cloudinary from "../../config/cloudinary";
import { publishTransformJob, publishUploadJob } from "../../queue/rabbitmq";
import CustomError from "../../types/customError";
import { HttpStatusText } from "../../types/HTTPStatusText";
import { ImageModel } from "./image.model";

export class ImageService {
  static async uploadImage(file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new CustomError("No image uploaded", 400, HttpStatusText.FAIL);
    }

    if (!userId) {
      throw new CustomError("Unauthorized", 401, HttpStatusText.FAIL);
    }

    const pendingImage = await ImageModel.createPending(userId);

    const job = {
      uploadId: pendingImage.id,
      userId,
      fileBuffer: file.buffer.toString("base64"),
    };

    publishUploadJob(job);

    return {
      uploadId: pendingImage.id,
      status: pendingImage.status,
      message: "Image upload enqueued, processing asynchronously",
    };
  }

  static async getImage(publicId: string) {
    if (!publicId || publicId.trim() === ":publicId") {
      throw new CustomError("Image publicId is required", 400, HttpStatusText.FAIL);
    }

    const image = await ImageModel.findByPublicId(publicId);
    if (!image) {
      throw new CustomError("Image not found", 404, HttpStatusText.FAIL);
    }

    return cloudinary.url(publicId);
  }

  static async transform(transformations: any, id: string): Promise<string> {
    if (!id) {
      throw new CustomError("Image id is required", 400, HttpStatusText.FAIL);
    }

    if (!transformations) {
      throw new CustomError("Transformations are required", 400, HttpStatusText.FAIL);
    }

    const image = await ImageModel.findByPublicId(id);
    if (!image) {
      throw new CustomError("Image not found", 404, HttpStatusText.FAIL);
    }

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

  static async getUploadStatus(uploadId: string) {
    if (!uploadId) {
      throw new CustomError("Upload ID is required", 400, HttpStatusText.FAIL);
    }

    const image = await ImageModel.findById(uploadId);
    if (!image) {
      throw new CustomError("Upload not found", 404, HttpStatusText.FAIL);
    }

    return {
      id: image.id,
      status: image.status,
      publicId: image.publicId,
      url: image.url,
    };
  }

  static async getImages(userId: number, page: number, limit: number) {
    if (!userId || Number.isNaN(userId)) {
      throw new CustomError("Unauthorized", 401, HttpStatusText.FAIL);
    }

    const p = Number(page);
    const l = Number(limit);

    if (!Number.isInteger(p) || p < 1 || !Number.isInteger(l) || l < 1) {
      throw new CustomError("Invalid pagination parameters", 400, HttpStatusText.FAIL);
    }

    const skip = (p - 1) * l;

    return ImageModel.findByUserIdPaginated(userId, skip, l);
  }
}
