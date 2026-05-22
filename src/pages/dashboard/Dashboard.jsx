import { FiLayers, FiCheckSquare, FiClock, FiAlertCircle, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import SummaryCard from '../../components/dashboard/SummaryCard';
import { CompletionTrendChart, StatusDistributionChart } from '../../components/dashboard/DashboardCharts';
import { RecentActivity, UpcomingDeadlines } from '../../components/dashboard/DashboardWidgets';
import { format } from 'date-fns';

const mockTrendData = [
  { name: 'Mon', completed: 4 }, { name: 'Tue', completed: 7 },
  { name: 'Wed', completed: 5 }, { name: 'Thu', completed: 10 },
  { name: 'Fri', completed: 8 }, { name: 'Sat', completed: 2 },
  { name: 'Sun', completed: 3 },
];

const mockStatusData = [
  { name: 'To Do', value: 12 },
  { name: 'In Progress', value: 8 },
  { name: 'Done', value: 24 },
];

const mockActivities = [
  { id:1, type:'status',     user:'Admin User', action:'moved task to Done',   target:'Setup CI/CD Pipeline', time:'2 hours ago' },
  { id:2, type:'assignment', user:'Sarah Lee',  action:'was assigned to',      target:'Design System Update', time:'4 hours ago' },
  { id:3, type:'status',     user:'Mike Chen',  action:'created a new task',   target:'Fix Navigation Bug',   time:'Yesterday' },
  { id:4, type:'assignment', user:'James Park', action:'commented on',         target:'API Rate Limiting',    time:'Yesterday' },
];

const mockDeadlines = [
  { id:1, title:'Finalize Q3 Marketing Report',       dueDate: new Date().toISOString(),                       priority:'HIGH' },
  { id:2, title:'Update User Authentication Flow',    dueDate: new Date(Date.now()+86400000).toISOString(),    priority:'MEDIUM' },
  { id:3, title:'Client Onboarding Documentation',   dueDate: new Date(Date.now()+172800000).toISOString(),   priority:'LOW' },
  { id:4, title:'Performance Optimization Sprint',   dueDate: new Date(Date.now()+259200000).toISOString(),   priority:'HIGH' },
];

const summaryCards = [
  { title:'Total Tasks', count:'44', icon:FiLayers,      trend:'up',   trendValue:'12%', accentColor:'#6366f1' },
  { title:'Completed',   count:'24', icon:FiCheckSquare, trend:'up',   trendValue:'8%',  accentColor:'#10b981' },
  { title:'In Progress', count:'8',  icon:FiClock,       trend:'down', trendValue:'2%',  accentColor:'#f59e0b' },
  { title:'Overdue',     count:'4',  icon:FiAlertCircle, trend:'down', trendValue:'5%',  accentColor:'#ef4444' },
];

const Dashboard = () => {
  const { user } = useSelector(s => s.auth);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="pb-8 space-y-7">

      {/* ── Header ─────────────────────────────────── */}
      <motion.div
        initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.3}}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[13px] mb-1" style={{color:'var(--text-3)'}}>
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
          <h1 className="font-display font-bold text-[1.9rem]" style={{letterSpacing:'-.03em', color:'var(--text)'}}>
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="mt-1 text-[13px]" style={{color:'var(--text-2)'}}>
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Quick stats pill */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl shrink-0"
          style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
          <FiTrendingUp size={14} style={{color:'var(--success)'}} />
          <span className="text-[12px]" style={{color:'var(--text-2)'}}>
            <strong style={{color:'var(--success)'}}>+18%</strong> productivity vs last week
          </span>
        </div>
      </motion.div>

      {/* ── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((c, i) => (
          <SummaryCard key={c.title} {...c} index={i} />
        ))}
      </div>

      {/* ── Progress bar section ────────────────────── */}
      <motion.div
        initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:.15, duration:.3}}
        className="card p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display font-semibold text-[15px]" style={{color:'var(--text)'}}>
              Sprint Progress
            </h3>
            <p className="text-[12px]" style={{color:'var(--text-3)'}}>24 of 44 tasks complete · Week 3 of 4</p>
          </div>
          <span className="font-display font-bold text-[1.4rem]" style={{color:'var(--accent-2)'}}>54%</span>
        </div>
        <div className="progress-bar" style={{height:6}}>
          <motion.div
            className="progress-fill"
            style={{background:'linear-gradient(90deg, var(--accent), var(--accent-2))', width:0}}
            animate={{width:'54%'}}
            transition={{delay:.4, duration:.8, ease:'easeOut'}}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            {[
              {label:'Done', val:24, color:'var(--success)'},
              {label:'In progress', val:8, color:'var(--warning)'},
              {label:'To do', val:12, color:'var(--accent-2)'},
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{background:s.color}} />
                <span className="text-[11px]" style={{color:'var(--text-3)'}}>{s.label}: <strong style={{color:'var(--text-2)'}}>{s.val}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Charts ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <CompletionTrendChart data={mockTrendData} />
        </div>
        <div className="lg:col-span-1">
          <StatusDistributionChart data={mockStatusData} />
        </div>
      </div>

      {/* ── Widgets ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentActivity activities={mockActivities} />
        <UpcomingDeadlines tasks={mockDeadlines} />
      </div>
    </div>
  );
};

export default Dashboard;
