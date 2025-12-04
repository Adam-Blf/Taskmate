import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { createNote, updateNote } from '../api/notes';
import { fetchProjects } from '../api/projects';

export default function NoteForm({ note = null, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    project: note?.project?._id || ''
  });

  const { data: projects } = useQuery(['projects'], fetchProjects);

  const mutation = useMutation(
    note ? updateNote : createNote,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notes']);
        onClose();
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = note ? { id: note._id, ...formData } : formData;
    if (!payload.project) delete payload.project;
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">{note ? 'Edit Note' : 'New Note'}</h2>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-hidden">
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
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              className="w-full border rounded p-2"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              <option value="">No Project</option>
              {projects?.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
            <textarea
              className="w-full border rounded p-2 flex-1 resize-none font-mono"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="# My Note..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
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
              {mutation.isLoading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
