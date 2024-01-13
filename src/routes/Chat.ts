import express from "express";

import { isAdmin, protect } from "../middlewares/auth";
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

router.route("/group").post([protect, isAdmin], createGroupChat);
router.route("/rename").put([protect, isAdmin], renameGroup);
router.route("/groupadd").put([protect, isAdmin], addToGroup);
router.route("/groupremove").put([protect, isAdmin], removeFromGroup);
router.route("/groupdelete").delete([protect, isAdmin], deleteGroupChat);

export default router;
