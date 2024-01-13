import {
  getMessagesPerChat,
  likeMessage,
  sendMessage,
} from "../controllers/Message";
import { protect } from "../middlewares/auth";

const express = require("express");

const router = express.Router();

router.route("/:chatId").get(protect, getMessagesPerChat);
router.route("/").post(protect, sendMessage);
router.route("/:messageId").patch(protect, likeMessage);

export default router;
