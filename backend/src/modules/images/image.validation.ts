import { z } from "zod";

export class ImageValidationSchemas {
  static publicIdParam = z.object({
    publicId: z.string().min(1, "publicId is required"),
  });

  static statusIdParam = z.object({
    id: z.string().min(1, "Image upload ID is required"),
  });

  static paginationQuery = z.object({
    page: z
      .preprocess((val) => Number(val), z.number().int().positive())
      .default(1),
    limit: z
      .preprocess((val) => Number(val), z.number().int().positive())
      .default(10),
  });

  static transformQuery = z.object({
    id: z.string().min(1, "Image id is required"),
  });

  static transformBody = z.object({
    transformations: z
      .object({
        resize: z
          .object({
            width: z.number().int().positive(),
            height: z.number().int().positive(),
          })
          .optional(),
        rotate: z.number().int().nonnegative().optional(),
        format: z.string().optional(),
        filters: z
          .object({
            grayscale: z.boolean().optional(),
            sepia: z.boolean().optional(),
          })
          .optional(),
      })
      .refine(
        (data) =>
          !!data.resize ||
          !!data.rotate ||
          !!data.format ||
          !!data.filters,
        {
          message: "At least one transformation must be provided",
        }
      ),
  });
}
