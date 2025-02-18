import mongoose from "mongoose";
import { IPostCommon } from "@nawaaz-dev/portfolio-types";

interface IPostsModel extends Document, IPostCommon {}

const PostSchema = new mongoose.Schema<IPostsModel>(
  {
    tab: {
      type: String,
      enum: ["experience", "tech_stack", "project", "education"],
      required: true,
    },
    title: { type: String, required: true },
    image: { type: String, required: true }, // Logo or image URL
    time: { type: String, required: true }, // Different formats per tab

    // Tab-specific details stored as a nested object
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // User interactions
    actions: {
      likes: { type: Number, default: 0 },
      comments: {
        type: [{ user: String, text: String, timestamp: Date }],
        default: [],
      },
      shares: { type: Number, default: 0 },
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;
