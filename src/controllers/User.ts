import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Document } from "mongoose";

import User from "../models/User";
import { generateToken } from "../config/generateToken";
import { AuthUserReq } from "../types/User";

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all required fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("User creation failed");
    }
  }
);

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const getUsers = asyncHandler(async (req: AuthUserReq, res: Response) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user!._id }, // Request will always have user Object as it is protected by protect middleware
  });
  res.send(users);
});

const makeAdmin = asyncHandler(async (req: AuthUserReq, res: Response) => {
  if (!req.params.userId) {
    res.status(400);
    throw new Error("Please provide User Id");
  }

  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.updateOne({ $set: { isAdmin: true } });

  res
    .status(200)
    .json({ message: "User has been upgraded to Admin successfully" });
});

export { registerUser, loginUser, getUsers, makeAdmin };
