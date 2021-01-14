import { Schema, Model, model, Document, Types } from "mongoose";
export interface IPostModel extends Document {}

const IPostSchema = new Schema(
  {
    _id: { type: Types.ObjectId, default: Types.ObjectId },
    id: { type: String },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PostModel: Model<IPostModel> = model<IPostModel>("Post", IPostSchema);
