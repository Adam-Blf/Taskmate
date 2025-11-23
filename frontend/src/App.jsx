import { useMemo, useState, useEffect } from 'react';
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
  const { data: tasks = [], isLoading, isError, error, refetch } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [editingTask, setEditingTask] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-slate-200 dark:border-dark-700 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200">
              TaskMate
            </h1>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-dark-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TaskForm
              initialTask={editingTask}
              isSubmitting={isSubmitting}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => setEditingTask(null)}
            />
            <TaskList
              tasks={sortedTasks}
              isProcessing={processingId}
              onEdit={setEditingTask}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <StatsPanel />
            </div>
          </div>
        </div>
      </main>

      {(isLoading || isError) && (
        <div className="fixed inset-0 bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {isLoading ? (
            <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Chargement...</span>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 max-w-md text-center border border-red-100 dark:border-red-900/30 animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Erreur de connexion</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Impossible de contacter le serveur. Vérifiez que le backend est lancé.
                  <br/>
                  <span className="text-xs opacity-75 font-mono mt-2 block bg-slate-100 dark:bg-dark-900 p-1 rounded">{error?.message || 'Erreur inconnue'}</span>
                </p>
              </div>
              <button 
                onClick={() => refetch()}
                className="btn btn-primary w-full"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
