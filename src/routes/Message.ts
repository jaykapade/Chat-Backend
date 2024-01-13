import { getMessagesPerChat, sendMessage } from "../controllers/Message";
import { protect } from "../middlewares/auth";

const express = require("express");

const router = express.Router();

router.route("/:chatId").get(protect, getMessagesPerChat);
router.route("/").post(protect, sendMessage);

export default router;
