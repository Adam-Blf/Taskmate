import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['paragraph', 'heading_1', 'heading_2', 'heading_3', 'image', 'list_item', 'code'],
    default: 'paragraph'
  },
  content: { type: String, default: '' },
  properties: { type: Map, of: String } // For metadata like image URLs, checked state, etc.
}, { _id: true });

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    blocks: {
      type: [blockSchema],
      default: []
    },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Index for full-text search and finding notes by title (for WikiLinks)
noteSchema.index({ title: 'text', 'blocks.content': 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
