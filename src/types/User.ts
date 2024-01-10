import { Request } from "express";
import { Document } from "mongoose";

export type IUser = Document & {
  name: string;
  email: string;
  password: string;
  pic?: string;
  isAdmin?: boolean;

  matchPassword: (enteredPassword: string) => Promise<boolean>;
};

export type AuthUserReq = Request & {
  user?: Document<IUser>;
};
