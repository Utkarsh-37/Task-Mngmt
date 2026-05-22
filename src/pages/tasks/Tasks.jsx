import { useState, useMemo } from 'react';
import { FiPlus, FiGrid, FiList, FiSearch, FiFilter, FiX, FiColumns } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '../../components/task/TaskCard';
import CreateTaskModal from '../../components/task/CreateTaskModal';
import toast from 'react-hot-toast';

const INITIAL_TASKS = [
  { _id:'1', title:'Implement JWT Auth',     description:'Setup backend middleware for token-based authentication and refresh flows.',   status:'TODO',        priority:'HIGH',   dueDate:new Date().toISOString(),                     assignedTo:{name:'Alice Johnson'},  commentCount:3 },
  { _id:'2', title:'Design Landing Page',    description:'Create polished Figma mocks for the new homepage. Include mobile breakpoints.',status:'IN_PROGRESS', priority:'MEDIUM', dueDate:new Date(Date.now()+86400000).toISOString(),  assignedTo:{name:'Bob Martinez'},   commentCount:1 },
  { _id:'3', title:'Fix Header Bug',         description:'Mobile menu is overlapping the logo on small screens — critical fix.',         status:'DONE',        priority:'LOW',    dueDate:new Date(Date.now()-86400000).toISOString(),  assignedTo:{name:'Charlie Davis'},  commentCount:0 },
  { _id:'4', title:'API Rate Limiting',      description:'Add Redis-backed rate limiting to all public API endpoints.',                   status:'IN_REVIEW',   priority:'URGENT', dueDate:new Date(Date.now()+172800000).toISOString(), assignedTo:{name:'Diana Chen'},     commentCount:5 },
  { _id:'5', title:'Accessibility Audit',    description:'Ensure WCAG 2.1 AA compliance across all main components and pages.',          status:'TODO',        priority:'MEDIUM', dueDate:new Date(Date.now()+259200000).toISOString(), assignedTo:{name:'Alice Johnson'},  commentCount:2 },
  { _id:'6', title:'CI/CD Pipeline Setup',   description:'Automated testing and deployment via GitHub Actions. Staging + production.',   status:'DONE',        priority:'HIGH',   dueDate:new Date(Date.now()-172800000).toISOString(), assignedTo:{name:'Bob Martinez'},   commentCount:7 },
];

const STATUSES = ['All','TODO','IN_PROGRESS','IN_REVIEW','DONE'];
const STATUS_LABELS = { All:'All', TODO:'To Do', IN_PROGRESS:'In Progress', IN_REVIEW:'In Review', DONE:'Done' };
const STATUS_COLS = [
  { id:'TODO',        label:'To Do',       color:'#6366f1', count: 0 },
  { id:'IN_PROGRESS', label:'In Progress', color:'#f59e0b', count: 0 },
  { id:'IN_REVIEW',   label:'In Review',   color:'#a855f7', count: 0 },
  { id:'DONE',        label:'Done',        color:'#10b981', count: 0 },
];

const EmptyState = ({ status, onCreate }) => (
  <div className="empty-state py-12">
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="var(--surface-2)" />
      <path d="M14 20h12M20 14v12" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <h4>No {status === 'All' ? '' : STATUS_LABELS[status]?.toLowerCase() + ' '}tasks</h4>
    <p>Create a new task to get started</p>
    <button className="btn btn-primary btn-sm mt-2" onClick={onCreate}>
      <FiPlus size={12} /> New Task
    </button>
  </div>
);

const Tasks = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let t = tasks;
    if (search) t = t.filter(x => x.title.toLowerCase().includes(search.toLowerCase()) || x.description?.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== 'All') t = t.filter(x => x.status === filterStatus);
    if (filterPriority !== 'All') t = t.filter(x => x.priority === filterPriority);
    return t;
  }, [tasks, search, filterStatus, filterPriority]);

  const handleCreated = (data) => {
    const newTask = {
      _id: Date.now().toString(),
      title: data.title,
      description: data.description || '',
      status: data.status || 'TODO',
      priority: data.priority || 'MEDIUM',
      dueDate: data.dueDate?.toISOString() || new Date().toISOString(),
      assignedTo: { name: data.assignedTo || 'Unassigned' },
      commentCount: 0,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t._id !== id));
    toast.success('Task deleted');
  };

  const activeFilters = (filterStatus !== 'All' ? 1 : 0) + (filterPriority !== 'All' ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="pb-8">
      {/* ── Header ─────────────────────────────────── */}
      <motion.div
        initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="font-display font-bold text-[1.75rem]" style={{color:'var(--text)', letterSpacing:'-.03em'}}>
            Tasks
          </h1>
          <p className="text-[13px] mt-1" style={{color:'var(--text-2)'}}>
            {tasks.length} tasks · {tasks.filter(t=>t.status==='DONE').length} completed
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center rounded-[10px] p-1 gap-0.5"
            style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
            {[
              {mode:'kanban', icon:FiColumns, label:'Board'},
              {mode:'grid',   icon:FiGrid,    label:'Grid'},
              {mode:'list',   icon:FiList,    label:'List'},
            ].map(({mode, icon:Icon, label}) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={label}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[12px] font-medium transition-all"
                style={{
                  background: viewMode===mode ? 'var(--accent)' : 'transparent',
                  color: viewMode===mode ? '#fff' : 'var(--text-3)',
                }}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className="btn btn-ghost"
            style={activeFilters > 0 ? {borderColor:'var(--accent)', color:'var(--accent-2)'} : {}}
          >
            <FiFilter size={13} />
            Filters
            {activeFilters > 0 && (
              <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{background:'var(--accent)'}}>
                {activeFilters}
              </span>
            )}
          </button>

          {/* New Task */}
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <FiPlus size={14} /> New Task
          </button>
        </div>
      </motion.div>

      {/* ── Search & Filters ───────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}
            className="overflow-hidden mb-5"
          >
            <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0 w-full sm:max-w-xs">
                <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'var(--text-3)'}} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks…"
                  className="input-base pl-9"
                  style={{paddingTop:8, paddingBottom:8}}
                />
              </div>

              {/* Status filter */}
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="input-base w-auto" style={{width:'auto', minWidth:140, cursor:'pointer'}}>
                {STATUSES.map(s => <option key={s} value={s}>{s==='All'?'All Statuses':STATUS_LABELS[s]}</option>)}
              </select>

              {/* Priority filter */}
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                className="input-base w-auto" style={{width:'auto', minWidth:140, cursor:'pointer'}}>
                {['All','URGENT','HIGH','MEDIUM','LOW'].map(p => <option key={p} value={p}>{p==='All'?'All Priorities':p.charAt(0)+p.slice(1).toLowerCase()}</option>)}
              </select>

              {/* Clear */}
              {activeFilters > 0 && (
                <button className="btn btn-sm btn-ghost" onClick={() => { setSearch(''); setFilterStatus('All'); setFilterPriority('All'); }}>
                  <FiX size={12} /> Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results count ──────────────────────────── */}
      {(search || filterStatus !== 'All' || filterPriority !== 'All') && (
        <p className="text-[12px] mb-4" style={{color:'var(--text-3)'}}>
          Showing {filtered.length} of {tasks.length} tasks
        </p>
      )}

      {/* ── Kanban board ───────────────────────────── */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="kanban-col" style={{minWidth:270, maxWidth:310}}>
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:'1px solid var(--border)'}}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{background:col.color}} />
                    <span className="text-[13px] font-semibold" style={{color:'var(--text)'}}>{col.label}</span>
                  </div>
                  <span className="tag" style={{background:`${col.color}18`, color:col.color, fontSize:11}}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto" style={{maxHeight:'calc(100vh - 280px)'}}>
                  <AnimatePresence>
                    {colTasks.length === 0
                      ? <EmptyState status={col.id} onCreate={() => setIsModalOpen(true)} />
                      : colTasks.map((task, i) => (
                          <TaskCard key={task._id} task={task} index={i}
                            onDelete={handleDelete} onEdit={() => {}} />
                        ))
                    }
                  </AnimatePresence>
                </div>

                {/* Add card */}
                <div className="p-3" style={{borderTop:'1px solid var(--border)'}}>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-[9px] text-[12px] transition-colors"
                    style={{color:'var(--text-3)', border:'1.5px dashed var(--border)'}}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-3)'; }}
                  >
                    <FiPlus size={12} /> Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Grid view ──────────────────────────────── */}
      {viewMode === 'grid' && (
        <AnimatePresence>
          {filtered.length === 0
            ? <EmptyState status={filterStatus} onCreate={() => setIsModalOpen(true)} />
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filtered.map((task, i) => (
                  <TaskCard key={task._id} task={task} index={i} onDelete={handleDelete} onEdit={() => {}} />
                ))}
              </div>
            )
          }
        </AnimatePresence>
      )}

      {/* ── List view ──────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="card overflow-hidden">
          {filtered.length === 0
            ? <EmptyState status={filterStatus} onCreate={() => setIsModalOpen(true)} />
            : (
              <div className="divide-y" style={{borderColor:'var(--border)'}}>
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider"
                  style={{color:'var(--text-3)'}}>
                  <span>Task</span>
                  <span>Priority</span>
                  <span className="hidden sm:block">Assignee</span>
                  <span className="hidden md:block">Due</span>
                  <span>Status</span>
                </div>
                {filtered.map((task, i) => {
                  const overdue = new Date(task.dueDate) < new Date() && task.status !== 'DONE';
                  const pc = { HIGH:{bg:'rgba(239,68,68,.1)',color:'#f87171'}, MEDIUM:{bg:'rgba(245,158,11,.1)',color:'#fbbf24'}, LOW:{bg:'rgba(99,102,241,.1)',color:'#a5b4fc'}, URGENT:{bg:'rgba(168,85,247,.1)',color:'#c084fc'} };
                  const sc = { TODO:{bg:'rgba(99,102,241,.1)',color:'#a5b4fc',label:'To Do'}, IN_PROGRESS:{bg:'rgba(245,158,11,.1)',color:'#fbbf24',label:'In Progress'}, IN_REVIEW:{bg:'rgba(168,85,247,.1)',color:'#c084fc',label:'Review'}, DONE:{bg:'rgba(16,185,129,.1)',color:'#34d399',label:'Done'} };
                  const p = pc[task.priority] || pc.LOW;
                  const s = sc[task.status] || sc.TODO;
                  return (
                    <motion.div
                      key={task._id}
                      initial={{opacity:0,x:-4}} animate={{opacity:1,x:0}} transition={{delay:i*.03}}
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center transition-colors"
                      style={{cursor:'pointer'}}
                      onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <div>
                        <p className="text-[13px] font-medium" style={{color:'var(--text)'}}>{task.title}</p>
                        {task.description && <p className="text-[11px] mt-0.5 truncate" style={{color:'var(--text-3)'}}>{task.description}</p>}
                      </div>
                      <span className="tag" style={{background:p.bg, color:p.color}}>{task.priority}</span>
                      <span className="text-[12px] hidden sm:block" style={{color:'var(--text-2)'}}>{task.assignedTo?.name?.split(' ')[0]}</span>
                      <span className="text-[12px] hidden md:block" style={{color: overdue ? 'var(--danger)' : 'var(--text-3)'}}>
                        {new Date(task.dueDate).toLocaleDateString('en',{month:'short',day:'numeric'})}
                      </span>
                      <span className="tag" style={{background:s.bg, color:s.color}}>{s.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            )
          }
        </div>
      )}

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
    </div>
  );
};

export default Tasks;
