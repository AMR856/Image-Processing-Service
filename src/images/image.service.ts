import cloudinary from "../config/cloudinary";

export class ImageService {
  static async uploadImage(file: Express.Multer.File, userId: number) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `images/${userId}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(file.buffer);
    });
  }

  static async getImage(publicId: string) {
    return cloudinary.url(publicId);
  }
}