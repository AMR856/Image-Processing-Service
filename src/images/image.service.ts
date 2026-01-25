import cloudinary from "../config/cloudinary";
import CustomError from "../types/customError";

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
    if (!id) {
      throw new CustomError("Image id is required", 400);
    }

    if (!transformations) {
      throw new CustomError("Transformations are required", 400);
    }

    const cloudinaryTransforms: any[] = [];

    if (transformations.resize) {
      cloudinaryTransforms.push({
        width: transformations.resize.width,
        height: transformations.resize.height,
        crop: "scale",
      });
    }

    if (transformations.crop) {
      cloudinaryTransforms.push({
        crop: "crop",
        width: transformations.crop.width,
        height: transformations.crop.height,
        x: transformations.crop.x,
        y: transformations.crop.y,
      });
    }

    if (transformations.rotate) {
      cloudinaryTransforms.push({ angle: transformations.rotate });
    }

    if (transformations.filters?.grayscale) {
      cloudinaryTransforms.push({ effect: "grayscale" });
    }

    if (transformations.filters?.sepia) {
      cloudinaryTransforms.push({ effect: "sepia" });
    }

    return cloudinary.url(id, {
      transformation: cloudinaryTransforms,
      fetch_format: transformations.format || "auto",
      secure: true,
    });
  }
}
