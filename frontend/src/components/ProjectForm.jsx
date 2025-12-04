import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createProject, updateProject } from '../api/projects';

export default function ProjectForm({ project = null, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    goal: project?.goal || '',
    deadline: project?.deadline ? project.deadline.substring(0, 10) : ''
  });

  const mutation = useMutation(
    project ? updateProject : createProject,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
        onClose();
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = project ? { id: project._id, ...formData } : formData;
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{project ? 'Edit Project' : 'New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full border rounded p-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded p-2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goal</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isLoading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
