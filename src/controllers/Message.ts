import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import Message from "../models/Message";
import { AuthUserReq } from "../types/User";
import User from "../models/User";
import Chat from "../models/Chat";

const getMessagesPerChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) {
      res.status(400);
      throw new Error("Please provide Chat Id");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(
  async (req: AuthUserReq, res: Response): Promise<void> => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      res.sendStatus(400);
      throw new Error("Please provide content and chatId");
    }

    let newMessage = {
      sender: req.user!._id,
      content: content,
      chat: chatId,
    };

    try {
      let message: any = await Message.create(newMessage);

      const chat = await Chat.findById(chatId);

      if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
      }

      message = await message.populate([
        { path: "sender", select: "name pic" },
        { path: "chat" },
      ]);

      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

      res.json(message);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

const likeMessage = asyncHandler(
  async (req: AuthUserReq, res: Response): Promise<void> => {
    const messageId = req.params.messageId;

    if (!messageId) {
      res.sendStatus(400);
      throw new Error("Please provide Message Id");
    }

    try {
      let message: any = await Message.findById(messageId);

      if (!message) {
        res.status(404);
        throw new Error("Message not found");
      }

      const likedMessage = await message.like(req.user!._id);

      res.json(likedMessage);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

export { getMessagesPerChat, sendMessage, likeMessage };
