// server/src/models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    date:        { type: Date, required: true },
    location:    { type: String, required: true },
    category: {
      type: String,
      enum: ["hackathon", "workshop", "seminar", "cultural", "technical", "other"],
      default: "other",
    },
    imageUrl: { type: String, default: null }, // Cloudinary URL

    isPast: { type: Boolean, default: false },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
