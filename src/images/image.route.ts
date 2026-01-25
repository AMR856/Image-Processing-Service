import { Router } from "express";
import { ImageController } from "./image.controller";
import { upload } from "../utils/multer";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  ImageController.upload
);

router.post('/transform', ImageController.transform);
router.get("/:publicId", ImageController.get);
export default router;
