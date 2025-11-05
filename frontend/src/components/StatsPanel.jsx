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
      <header className="card-header">
        <h2>Statistiques d&apos;efficacité</h2>
        {isLoading && <span className="caption">Chargement…</span>}
      </header>
      <div className="stats-grid">
        {metrics.map((metric) => (
          <div key={metric.key} className="stat-tile">
            <span className="stat-label">{metric.label}</span>
            <strong className="stat-value">
              {formatValue(data?.[metric.key], metric.suffix)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsPanel;
