const styles = {
  critical: { background: '#f87171', color: '#7f1d1d' },
  urgent: { background: '#fb923c', color: '#7c2d12' },
  important: { background: '#facc15', color: '#713f12' },
  normal: { background: '#a5b4fc', color: '#1e3a8a' },
  low: { background: '#cbd5f5', color: '#374151' }
};

const labels = {
  critical: 'Critique',
  urgent: 'Urgent',
  important: 'Important',
  normal: 'Normal',
  low: 'Faible'
};

const PriorityBadge = ({ label = 'normal' }) => {
  const style = styles[label] || styles.normal;
  const text = labels[label] || label;
  return (
    <span
      style={{
        ...style,
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: 0.3
      }}
    >
      {text.toUpperCase()}
    </span>
  );
};

export default PriorityBadge;
