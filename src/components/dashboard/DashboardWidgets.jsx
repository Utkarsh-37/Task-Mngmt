import { FiClock, FiCheckCircle, FiUserPlus, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { format, isPast } from 'date-fns';
import { motion } from 'framer-motion';

const ACTIVITY_ICONS = {
  status:     { icon: FiCheckCircle, color: 'var(--success)',  bg: 'rgba(16,185,129,.12)' },
  assignment: { icon: FiUserPlus,    color: 'var(--accent-2)', bg: 'rgba(99,102,241,.12)' },
  default:    { icon: FiClock,       color: 'var(--text-3)',   bg: 'var(--surface-2)' },
};

export const RecentActivity = ({ activities }) => (
  <div className="card p-6 h-full">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-display font-semibold text-base" style={{color:'var(--text)'}}>Recent Activity</h3>
      <button className="flex items-center gap-1 text-[12px]" style={{color:'var(--accent-2)'}}>
        View all <FiArrowRight size={12} />
      </button>
    </div>

    <div className="space-y-4">
      {activities.map((a, i) => {
        const cfg = ACTIVITY_ICONS[a.type] || ACTIVITY_ICONS.default;
        return (
          <motion.div
            key={a.id}
            initial={{opacity:0, x:-6}}
            animate={{opacity:1, x:0}}
            transition={{delay: i * 0.06}}
            className="flex gap-3"
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{background: cfg.bg}}>
              <cfg.icon size={13} style={{color: cfg.color}} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-snug" style={{color:'var(--text-2)'}}>
                <span className="font-semibold" style={{color:'var(--text)'}}>{a.user}</span>
                {' '}{a.action}{' '}
                <span className="font-semibold" style={{color:'var(--text)'}}>{a.target}</span>
              </p>
              <p className="text-[11px] mt-0.5" style={{color:'var(--text-3)'}}>{a.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const PRIORITY_STYLE = {
  HIGH:   { bg: 'rgba(239,68,68,.12)',  color: '#f87171' },
  MEDIUM: { bg: 'rgba(245,158,11,.12)', color: '#fbbf24' },
  LOW:    { bg: 'rgba(99,102,241,.12)', color: '#a5b4fc' },
};

export const UpcomingDeadlines = ({ tasks }) => (
  <div className="card p-6 h-full">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-display font-semibold text-base" style={{color:'var(--text)'}}>Upcoming Deadlines</h3>
      <button className="flex items-center gap-1 text-[12px]" style={{color:'var(--accent-2)'}}>
        View all <FiArrowRight size={12} />
      </button>
    </div>

    <div className="space-y-2">
      {tasks.map((task, i) => {
        const overdue = isPast(new Date(task.dueDate));
        const pStyle = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.LOW;
        return (
          <motion.div
            key={task.id}
            initial={{opacity:0, x:6}}
            animate={{opacity:1, x:0}}
            transition={{delay: i * 0.06}}
            className="flex items-center gap-3 p-3 rounded-xl transition-colors"
            style={{border:'1px solid transparent'}}
            onMouseEnter={e => { e.currentTarget.style.background='var(--surface-2)'; e.currentTarget.style.borderColor='var(--border)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}
          >
            {/* Overdue indicator */}
            <div className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{background: overdue ? 'var(--danger)' : 'var(--border-2)'}} />

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate" style={{color:'var(--text)'}}>{task.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FiClock size={10} style={{color: overdue ? 'var(--danger)' : 'var(--text-3)'}} />
                <span className="text-[11px]" style={{color: overdue ? 'var(--danger)' : 'var(--text-3)'}}>
                  {overdue ? 'Overdue · ' : ''}{format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <span className="tag shrink-0" style={{background: pStyle.bg, color: pStyle.color}}>
              {task.priority}
            </span>
          </motion.div>
        );
      })}
    </div>
  </div>
);
