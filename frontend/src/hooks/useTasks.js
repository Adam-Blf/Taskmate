import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask
} from '../api/tasks';

export const useTasks = () =>
  useQuery(['tasks'], fetchTasks, {
    staleTime: 1000 * 30
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['stats']);
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['stats']);
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['stats']);
    }
  });
};
