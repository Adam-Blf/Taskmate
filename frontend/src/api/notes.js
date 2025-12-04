import client from './client';

export const fetchNotes = async () => {
  const { data } = await client.get('/notes');
  return data;
};

export const createNote = async (payload) => {
  const { data } = await client.post('/notes', payload);
  return data;
};

export const updateNote = async ({ id, ...payload }) => {
  const { data } = await client.put(`/notes/${id}`, payload);
  return data;
};

export const deleteNote = async (id) => {
  await client.delete(`/notes/${id}`);
};

export const fetchNote = async (id) => {
  const { data } = await client.get(`/notes/${id}`);
  return data;
};
