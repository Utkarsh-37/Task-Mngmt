const SkeletonCard = ({ lines = 3, className = '' }) => (
  <div className={`card p-4 space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="skeleton rounded" style={{ height: 12, width: `${100 - i * 12}%` }} />
    ))}
    <div className="flex items-center justify-between pt-1">
      <div className="skeleton h-5 w-5 rounded-full" />
      <div className="skeleton h-4 w-16 rounded" />
    </div>
  </div>
);

export default SkeletonCard;
