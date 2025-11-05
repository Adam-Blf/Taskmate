import { useMemo, useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask
} from './hooks/useTasks.js';

const App = () => {
  const { data: tasks = [], isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [editingTask, setEditingTask] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const isSubmitting = createTask.isLoading || updateTask.isLoading;

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const priorityOrder = ['critical', 'urgent', 'important', 'normal', 'low'];
        const priorityA = priorityOrder.indexOf(a.priorityLabel);
        const priorityB = priorityOrder.indexOf(b.priorityLabel);
        if (priorityA !== priorityB) return priorityA - priorityB;
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      }),
    [tasks]
  );

  const handleCreateOrUpdate = (payload) => {
    if (editingTask?._id) {
      setProcessingId(editingTask._id);
      updateTask.mutate(
        { id: editingTask._id, ...payload },
        {
          onSuccess: () => setEditingTask(null),
          onSettled: () => setProcessingId(null)
        }
      );
    } else {
      createTask.mutate(payload);
    }
  };

  const handleToggleComplete = (task) => {
    setProcessingId(task._id);
    updateTask.mutate(
      { id: task._id, completed: !task.completed },
      {
        onSettled: () => setProcessingId(null)
      }
    );
  };

  const handleDelete = (task) => {
    if (!window.confirm(`Supprimer "${task.title}" ?`)) return;
    setProcessingId(task._id);
    deleteTask.mutate(task._id, {
      onSettled: () => setProcessingId(null)
    });
  };

  return (
    <main className="layout">
      <header className="page-header">
        <div>
          <h1>TaskMate</h1>
          <p>
            Gérez votre to-do list et laissez l&apos;IA légère classer vos priorités en urgent /
            important.
          </p>
        </div>
      </header>

      <div className="grid">
        <TaskForm
          initialTask={editingTask}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setEditingTask(null)}
        />
        <StatsPanel />
      </div>

      <TaskList
        tasks={sortedTasks}
        isProcessing={processingId}
        onEdit={setEditingTask}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
      />

      {isLoading && <div className="overlay">Chargement des tâches…</div>}
    </main>
  );
};

export default App;
