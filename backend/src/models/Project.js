import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active'
    },
    goal: { type: String, trim: true },
    deadline: { type: Date }
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
