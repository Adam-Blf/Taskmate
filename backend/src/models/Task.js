import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: Date },
    estimatedMinutes: { type: Number, default: 30 },
    completed: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    urgency: { type: Number, default: 0 },
    importance: { type: Number, default: 0 },
    priorityLabel: { type: String, default: 'normal' },
    completedAt: { type: Date },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Task = mongoose.model('Task', taskSchema);

export default Task;
