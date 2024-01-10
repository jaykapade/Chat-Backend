import express from "express";

import { getUsers, loginUser, registerUser } from "../controllers/User";
import { protect } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/").post(registerUser);
router.route("/login").post(loginUser);

export default router;
