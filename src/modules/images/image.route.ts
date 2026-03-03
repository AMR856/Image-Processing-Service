import { Router } from "express";
import { ImageController } from "./image.controller";
import { auth } from "../../middlewares/auth";
import { upload } from "../../storage/multer";

const router = Router();

router.post(
  "/",
  auth,
  upload.single("image"),
  ImageController.upload
);

router.post('/transform', ImageController.transform);
router.get("/:publicId", ImageController.get);
router.get("/", auth, ImageController.getImages);
export default router;

