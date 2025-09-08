import mongoose from 'mongoose';

// Educational or supportive content authored by an MHP.
// Supports either article body content or an external/video URL.
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  headline: { type: String },                // Optional short summary
  type: { type: String, enum: ['article', 'video'], required: true },
  content: { type: String },                 // Article text (if type=article)
  mediaUrl: { type: String },                // Video URL (if type=video)
  categories: [{ type: String }],            // Thematic tags
  mhpEmail: { type: String, required: true },// Author reference (email)
  mhpName: { type: String },                 // Denormalized for quick display
  createdAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
