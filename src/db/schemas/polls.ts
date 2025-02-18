import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    tab: {
      type: String,
      enum: ["experience", "tech_stack", "project", "education"],
      required: true,
    },
    title: { type: String, required: true },
    image: { type: String, required: true }, // Logo or image URL
    duration: { type: String, required: true }, // Different formats per tab

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

export default mongoose.model("Post", PostSchema);
