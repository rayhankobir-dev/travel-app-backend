import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { roleSchem } from "../validation/index.js";
import {
  changePassword,
  deleteUser,
  getProfile,
  getUsers,
  updateProfile,
} from "../controllers/user.controller.js";
import auth from "../middlewares/authentication.middleware.js";

const router = new Router();

router.get("/", getUsers);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/change-password", auth, changePassword);
router.post("/", validation(roleSchem.create), getProfile);
router.put("/", validation(roleSchem.create), getProfile);
router.delete("/:id", auth, deleteUser);

export default router;
