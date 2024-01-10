import express from "express";

import { loginUser, registerUser } from "../controllers/User";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);

export default router;
