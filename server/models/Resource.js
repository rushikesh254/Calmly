import mongoose from "mongoose";

// Educational / supportive resource created by a professional.
// Either long-form article content or a video/media reference.
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  headline: { type: String, trim: true }, // Short summary
  type: { type: String, enum: ["article", "video"], required: true },
  content: { type: String }, // If article
  mediaUrl: { type: String }, // If video
  categories: [{ type: String }], // Tags for filtering
  mhpEmail: { type: String, required: true, lowercase: true, trim: true }, // Author email
  mhpName: { type: String, trim: true }, // Denormalized display name
  createdAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
