import express from "express";

import { protect } from "../middlewares/auth";
import {
  addToGroup,
  createGroupChat,
  deleteGroupChat,
  removeFromGroup,
  renameGroup,
} from "../controllers/Chat";

const router = express.Router();

// TODO Do get chats route if time is present

// TODO add isAdmin middleware or add admin check in routes

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupdelete").delete(protect, deleteGroupChat);

export default router;
