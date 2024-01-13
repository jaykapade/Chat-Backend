import express from "express";

import {
  getUsers,
  loginUser,
  makeAdmin,
  registerUser,
} from "../controllers/User";
import { isAdmin, protect } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/:userId").put([protect, isAdmin], makeAdmin);
router.route("/").post(registerUser);
router.route("/login").post(loginUser);

export default router;
