import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  group: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  likes: number;
}

const MessageSchema: Schema = new Schema(
  {
    group: { type: mongoose.Types.ObjectId, ref: "Group", required: true },
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

MessageSchema.index({ group: 1, sender: 1 });

export default mongoose.model<IMessage>("Message", MessageSchema);
