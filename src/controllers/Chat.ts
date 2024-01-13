import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import Chat from "../models/Chat";

import { AuthUserReq } from "../types/User";
import Message from "../models/Message";

const createGroupChat = asyncHandler(
  async (req: AuthUserReq, res: Response): Promise<void> => {
    if (!req.body.users || !req.body.name) {
      res.status(400);
      throw new Error("Please Fill all the fields: atleast 2 users and a name");
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      res.status(400);
      throw new Error("More than 2 users are required to form a group chat");
    }

    users.push(req.user!);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

const deleteGroupChat = asyncHandler(
  async (req: AuthUserReq, res: Response): Promise<void> => {
    const chatId = req.body.chatId;

    try {
      // Check if the chat exists
      const existingChat = await Chat.findById(chatId);

      if (!existingChat) {
        res.status(404);
        throw new Error("Chat not found");
      }

      // Check if the user is the admin of the group chat
      if (existingChat.groupAdmin!.toString() !== req.user?._id!.toString()) {
        res.status(403);
        throw new Error("You are not authorized to delete this group chat");
      }

      // Delete associated messages
      await Message.deleteMany({ chat: existingChat._id });

      // Delete the chat
      await existingChat.deleteOne();

      res.status(200).json({ message: "Group chat deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

const renameGroup = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  }
);

const addToGroup = asyncHandler(async (req: AuthUserReq, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req: AuthUserReq, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

export {
  createGroupChat,
  deleteGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
