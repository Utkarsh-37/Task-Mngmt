import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'var(--surface-3)', border:'1px solid var(--border-2)',
      borderRadius:10, padding:'10px 14px', boxShadow:'var(--shadow-md)',
      fontSize:12,
    }}>
      {label && <p style={{color:'var(--text-2)', marginBottom:6, fontWeight:600}}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{color: entry.color, fontWeight:600}}>
          {entry.name}: <span style={{color:'var(--text)'}}>{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export const CompletionTrendChart = ({ data }) => (
  <div className="card p-6" style={{height:300}}>
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="font-display font-semibold text-base" style={{color:'var(--text)'}}>
          Completion Trend
        </h3>
        <p className="text-[12px] mt-0.5" style={{color:'var(--text-3)'}}>Tasks completed this week</p>
      </div>
      <span className="tag" style={{background:'rgba(99,102,241,.12)', color:'var(--accent-2)'}}>
        Weekly
      </span>
    </div>
    <ResponsiveContainer width="100%" height="75%">
      <AreaChart data={data} margin={{top:4, right:0, left:-24, bottom:0}}>
        <defs>
          <linearGradient id="gradAccent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="name" stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone" dataKey="completed" name="Completed"
          stroke="#6366f1" strokeWidth={2.5}
          fillOpacity={1} fill="url(#gradAccent)"
          dot={{ fill:'#6366f1', strokeWidth:0, r:3 }}
          activeDot={{ r:5, fill:'#818cf8', strokeWidth:2, stroke:'var(--surface)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const StatusDistributionChart = ({ data }) => {
  const COLORS = ['#6366f1','#f59e0b','#10b981'];
  const LABELS = ['To Do','In Progress','Done'];

  return (
    <div className="card p-6" style={{height:300}}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-base" style={{color:'var(--text)'}}>
          Status Distribution
        </h3>
        <p className="text-[12px] mt-0.5" style={{color:'var(--text-3)'}}>Breakdown by status</p>
      </div>
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={52} outerRadius={74}
            paddingAngle={4} dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom" height={32} iconType="circle" iconSize={7}
            formatter={(v, entry) => (
              <span style={{fontSize:11, color:'var(--text-2)'}}>{v}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
