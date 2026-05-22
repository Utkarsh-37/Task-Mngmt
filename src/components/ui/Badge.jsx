const VARIANTS = {
  default: { bg: 'rgba(99,102,241,.12)',  color: '#a5b4fc' },
  success: { bg: 'rgba(16,185,129,.12)',  color: '#34d399' },
  warning: { bg: 'rgba(245,158,11,.12)',  color: '#fbbf24' },
  danger:  { bg: 'rgba(239,68,68,.12)',   color: '#f87171' },
  purple:  { bg: 'rgba(168,85,247,.12)',  color: '#c084fc' },
  ghost:   { bg: 'rgba(255,255,255,.06)', color: '#9898bb' },
};

const Badge = ({ children, variant = 'default', className = '', style = {} }) => {
  const v = VARIANTS[variant] || VARIANTS.default;
  return (
    <span
      className={`tag ${className}`}
      style={{ background: v.bg, color: v.color, ...style }}
    >
      {children}
    </span>
  );
};

export default Badge;
