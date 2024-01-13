import { NextFunction, Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

import { AuthUserReq } from "../types/User";
import User from "../models/User";

export const protect = asyncHandler(
  async (req: AuthUserReq, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user! = await User.findById(decoded.id).select("-password");

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export const isAdmin = asyncHandler(
  async (req: AuthUserReq, res: Response, next: NextFunction) => {
    console.log("🚀 ~ req:", req.user);
    if (!req.user?.isAdmin) {
      res.status(401);
      throw new Error("Not authorized, only admin can do this operation");
    }
    next();
  }
);
