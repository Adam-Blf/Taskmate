import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import PriorityBadge from './PriorityBadge.jsx';

const formatDateTime = (value) => {
  if (!value) return '—';
  try {
    const date = new Date(value);
    return `${format(date, 'dd MMM · HH:mm', { locale: fr })} (${formatDistanceToNow(date, {
      addSuffix: true,
      locale: fr
    })})`;
  } catch (error) {
    return '—';
  }
};

const TaskList = ({ tasks, onEdit, onToggleComplete, onDelete, isProcessing }) => {
  if (!tasks?.length) {
    return (
      <section className="card">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vos tâches</h2>
        </header>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-slate-900 dark:text-white font-medium">Aucune tâche enregistrée</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ajoutez-en une avec le formulaire ci-dessus.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vos tâches</h2>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-dark-700 dark:text-slate-300">
          {tasks.length} élément(s)
        </span>
      </header>
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-dark-700">
              <th className="px-6 py-3 bg-slate-50 dark:bg-dark-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tâche</th>
              <th className="px-6 py-3 bg-slate-50 dark:bg-dark-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Échéance</th>
              <th className="px-6 py-3 bg-slate-50 dark:bg-dark-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priorité</th>
              <th className="px-6 py-3 bg-slate-50 dark:bg-dark-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scores</th>
              <th className="px-6 py-3 bg-slate-50 dark:bg-dark-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 bg-slate-50 dark:bg-dark-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-700">
            {tasks.map((task) => {
              const urgencyPercent = Math.round((task.urgency ?? 0) * 100);
              const importancePercent = Math.round((task.importance ?? 0) * 100);
              return (
                <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <strong className="block text-sm font-medium text-slate-900 dark:text-white">{task.title}</strong>
                      {task.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{task.description}</p>}
                      {!!task.tags?.length && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-dark-700 dark:text-slate-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDateTime(task.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge label={task.priorityLabel} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2 min-w-[120px]">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-dark-700 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${urgencyPercent}%` }} />
                        </div>
                        <span className="text-orange-600 dark:text-orange-400 w-8 text-right">{urgencyPercent}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-dark-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${importancePercent}%` }} />
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 w-8 text-right">{importancePercent}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.completed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">
                        Terminé
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400">
                        En cours
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="p-1 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        onClick={() => onEdit(task)}
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={`p-1 transition-colors ${
                          task.completed 
                            ? 'text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400' 
                            : 'text-slate-400 hover:text-green-600 dark:hover:text-green-400'
                        }`}
                        onClick={() => onToggleComplete(task)}
                        disabled={isProcessing === task._id}
                        title={task.completed ? 'Réouvrir' : 'Terminer'}
                      >
                        {task.completed ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <button
                        type="button"
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        onClick={() => onDelete(task)}
                        disabled={isProcessing === task._id}
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TaskList;
