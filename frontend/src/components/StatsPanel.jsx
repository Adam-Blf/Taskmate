import useStats from '../hooks/useStats';

const metrics = [
  { key: 'totalTasks', label: 'Total' },
  { key: 'activeTasks', label: 'Actives' },
  { key: 'completedTasks', label: 'Terminées' },
  { key: 'completionRate', label: 'Taux de complétion', suffix: '%' },
  { key: 'overdueTasks', label: 'En retard' },
  { key: 'averageUrgency', label: 'Urgence moyenne' },
  { key: 'averageImportance', label: 'Importance moyenne' },
  { key: 'focusScore', label: 'Focus score' },
  { key: 'averageCompletionHours', label: 'Temps moyen (h)' }
];

const formatValue = (value, suffix) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const numeric = Number(value);
  const display = Number.isFinite(numeric) ? numeric.toFixed(2).replace(/\.00$/, '') : value;
  return `${display}${suffix ?? ''}`;
};

const StatsPanel = () => {
  const { data, isLoading } = useStats();

  return (
    <section className="card">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Statistiques</h2>
        {isLoading && (
          <span className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
            Mise à jour...
          </span>
        )}
      </header>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.key} className="bg-slate-50 dark:bg-dark-700/50 p-4 rounded-lg border border-slate-100 dark:border-dark-700">
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {metric.label}
            </span>
            <strong className="block text-xl font-bold text-slate-900 dark:text-white">
              {formatValue(data?.[metric.key], metric.suffix)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsPanel;
