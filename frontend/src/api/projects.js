import client from './client';

export const fetchProjects = async () => {
  const { data } = await client.get('/projects');
  return data;
};

export const createProject = async (payload) => {
  const { data } = await client.post('/projects', payload);
  return data;
};

export const updateProject = async ({ id, ...payload }) => {
  const { data } = await client.put(`/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id) => {
  await client.delete(`/projects/${id}`);
};

export const fetchProject = async (id) => {
  const { data } = await client.get(`/projects/${id}`);
  return data;
};
