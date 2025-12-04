import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true }, // Markdown content
    tags: { type: [String], default: [] },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    linkedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    linkedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
