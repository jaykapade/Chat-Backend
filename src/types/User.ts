import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  pic?: string;
  isAdmin: boolean;

  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export interface AuthUserReq extends Request {
  user?: IUser;
}
