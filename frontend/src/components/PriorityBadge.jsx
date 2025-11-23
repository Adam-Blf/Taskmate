const styles = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
  urgent: 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400',
  important: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
  normal: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400',
  low: 'bg-slate-100 text-slate-800 dark:bg-slate-500/10 dark:text-slate-400'
};

const labels = {
  critical: 'Critique',
  urgent: 'Urgent',
  important: 'Important',
  normal: 'Normal',
  low: 'Faible'
};

const PriorityBadge = ({ label = 'normal' }) => {
  const className = styles[label] || styles.normal;
  const text = labels[label] || label;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${className}`}>
      {text}
    </span>
  );
};

export default PriorityBadge;
