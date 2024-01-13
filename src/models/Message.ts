import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

messageSchema.methods.like = async function (userId: string) {
  if (!this.likedBy.includes(userId)) {
    this.likedBy.push(userId);
    await this.save();
  }
  return this.populate("sender chat likedBy");
};

const Message = mongoose.model("Message", messageSchema);

export default Message;
