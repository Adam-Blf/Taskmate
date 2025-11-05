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
        <header className="card-header">
          <h2>Vos tâches</h2>
        </header>
        <div className="empty-state">
          <p>Aucune tâche enregistrée pour le moment.</p>
          <p className="hint">Ajoutez-en une avec le formulaire ci-dessus.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <header className="card-header">
        <h2>Vos tâches</h2>
        <span className="caption">{tasks.length} élément(s)</span>
      </header>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tâche</th>
              <th>Échéance</th>
              <th>Priorité</th>
              <th>Urgence / Importance</th>
              <th>Statut</th>
              <th style={{ width: '1%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const urgencyPercent = Math.round((task.urgency ?? 0) * 100);
              const importancePercent = Math.round((task.importance ?? 0) * 100);
              return (
                <tr key={task._id}>
                  <td>
                    <div className="task-title">
                      <strong>{task.title}</strong>
                      {task.description && <p>{task.description}</p>}
                      {!!task.tags?.length && (
                        <div className="tags">
                          {task.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{formatDateTime(task.dueDate)}</td>
                  <td>
                    <PriorityBadge label={task.priorityLabel} />
                  </td>
                  <td>
                    <div className="score-bar">
                      <div className="score urgency" style={{ width: `${urgencyPercent}%` }} />
                      <div className="score importance" style={{ width: `${importancePercent}%` }} />
                    </div>
                    <small className="hint">
                      {urgencyPercent}% urgent · {importancePercent}% important
                    </small>
                  </td>
                  <td>
                    {task.completed ? (
                      <span className="status done">Terminé</span>
                    ) : (
                      <span className="status pending">En cours</span>
                    )}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => onEdit(task)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => onToggleComplete(task)}
                        disabled={isProcessing === task._id}
                      >
                        {task.completed ? 'Réouvrir' : 'Terminer'}
                      </button>
                      <button
                        type="button"
                        className="ghost-button danger"
                        onClick={() => onDelete(task)}
                        disabled={isProcessing === task._id}
                      >
                        Supprimer
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
