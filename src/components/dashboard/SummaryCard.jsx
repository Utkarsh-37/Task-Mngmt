import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const SummaryCard = ({ title, count, icon: Icon, trend, trendValue, accentColor, index = 0 }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: .15 } }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Background glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-[.12]"
        style={{ background: accentColor }} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
          {title}
        </p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}1a`, border: `1px solid ${accentColor}33` }}>
          <Icon size={16} style={{ color: accentColor }} />
        </div>
      </div>

      {/* Count */}
      <p className="font-display text-[2.2rem] font-bold leading-none mb-3 relative z-10"
        style={{ color: 'var(--text)', letterSpacing: '-.03em' }}>
        {count}
      </p>

      {/* Trend */}
      <div className="flex items-center gap-2 relative z-10">
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
          style={{
            background: isPositive ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)',
            color: isPositive ? 'var(--success)' : 'var(--danger)',
          }}>
          {isPositive ? <FiTrendingUp size={11} /> : <FiTrendingDown size={11} />}
          {trendValue}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>vs last week</span>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
