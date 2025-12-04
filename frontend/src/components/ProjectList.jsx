import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchProjects, deleteProject } from '../api/projects';
import ProjectForm from './ProjectForm';

export default function ProjectList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery(['projects'], fetchProjects);

  const deleteMutation = useMutation(deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });

  if (isLoading) return <div className="p-4">Loading projects...</div>;
  if (error) return <div className="p-4 text-red-600">Error loading projects</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <div key={project._id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
            {project.goal && (
              <div className="text-xs text-gray-500 mb-2">
                <strong>Goal:</strong> {project.goal}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
              <button
                onClick={() => {
                  setEditingProject(project);
                  setIsFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete this project?')) {
                    deleteMutation.mutate(project._id);
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects?.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No projects found. Create one to get started!
          </div>
        )}
      </div>

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
