import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { AuthValidationSchemas } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validate({ body: AuthValidationSchemas.authSchema }),
  UserController.register,
);
router.post(
  "/login",
  validate({ body: AuthValidationSchemas.authSchema }),
  UserController.login,
);
router.get("/profile", auth, UserController.profile);

export default router;
