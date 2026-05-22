import { FiPlus } from 'react-icons/fi';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="empty-state">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <Icon size={22} style={{ color: 'var(--text-3)' }} />
      </div>
    )}
    <h4>{title}</h4>
    {description && <p>{description}</p>}
    {actionLabel && onAction && (
      <button className="btn btn-primary btn-sm mt-3" onClick={onAction}>
        <FiPlus size={12} /> {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
