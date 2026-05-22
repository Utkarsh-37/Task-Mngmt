import { motion } from 'framer-motion';
import { FiClock, FiMoreVertical, FiCheckCircle, FiCircle, FiMessageSquare, FiPaperclip, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format, isPast } from 'date-fns';
import { useState, useRef, useEffect } from 'react';

const PRIORITY_CONFIG = {
  HIGH:   { bg:'rgba(239,68,68,.1)',   color:'#f87171',  label:'High',   dot:'#ef4444' },
  MEDIUM: { bg:'rgba(245,158,11,.1)',  color:'#fbbf24',  label:'Medium', dot:'#f59e0b' },
  LOW:    { bg:'rgba(99,102,241,.1)',  color:'#a5b4fc',  label:'Low',    dot:'#6366f1' },
  URGENT: { bg:'rgba(168,85,247,.1)',  color:'#c084fc',  label:'Urgent', dot:'#a855f7' },
};

const STATUS_CONFIG = {
  TODO:        { icon: FiCircle,      color:'var(--text-3)' },
  IN_PROGRESS: { icon: FiClock,       color:'var(--warning)' },
  IN_REVIEW:   { icon: FiClock,       color:'var(--purple)' },
  DONE:        { icon: FiCheckCircle, color:'var(--success)' },
};

const TaskCard = ({ task, onEdit, onDelete, index = 0 }) => {
  const overdue = isPast(new Date(task.dueDate)) && task.status !== 'DONE';
  const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.LOW;
  const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
  const StatusIcon = sc.icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:12 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:.95 }}
      transition={{ delay: index * 0.04, duration:.25 }}
      whileHover={{ y:-2 }}
      className="card p-4 relative group cursor-pointer"
      style={{ overflow:'hidden' }}
    >
      {/* Priority accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: pc.dot }} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3 pl-2">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusIcon size={14} style={{ color: sc.color, flexShrink:0 }} />
          <span className="tag" style={{ background: pc.bg, color: pc.color }}>
            {pc.label}
          </span>
          {task.status === 'DONE' && (
            <span className="tag" style={{ background:'rgba(16,185,129,.1)', color:'var(--success)' }}>
              Done
            </span>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
            className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ width:28, height:28, border:'none', background:'transparent' }}
          >
            <FiMoreVertical size={14} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu absolute right-0 top-8 z-20">
              <button className="dropdown-item" onClick={() => { onEdit?.(task); setMenuOpen(false); }}>
                <FiEdit2 size={12} /> Edit task
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={() => { onDelete?.(task._id); setMenuOpen(false); }}>
                <FiTrash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="font-display font-semibold text-[14px] pl-2 mb-1.5 leading-snug line-clamp-2"
        style={{ color:'var(--text)', letterSpacing:'-.01em' }}>
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-[12px] pl-2 mb-3 line-clamp-2 leading-relaxed"
          style={{ color:'var(--text-3)' }}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-2 pt-3"
        style={{ borderTop:'1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          {/* Assignee avatar */}
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background:'linear-gradient(135deg, var(--accent), var(--purple))' }}>
            {task.assignedTo?.name?.substring(0,2).toUpperCase() || 'UN'}
          </div>
          <span className="text-[11px]" style={{color:'var(--text-3)'}}>
            {task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}
          </span>
        </div>

        {/* Meta: comments, attachments, due date */}
        <div className="flex items-center gap-3">
          {task.commentCount > 0 && (
            <span className="flex items-center gap-1 text-[11px]" style={{color:'var(--text-3)'}}>
              <FiMessageSquare size={11} /> {task.commentCount}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px]"
            style={{ color: overdue ? 'var(--danger)' : 'var(--text-3)' }}>
            <FiClock size={11} />
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
