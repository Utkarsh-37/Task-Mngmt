import { Outlet } from 'react-router-dom';

const features = [
  { icon: '⚡', label: 'Real-time task tracking', desc: 'See updates as they happen across your team' },
  { icon: '🎯', label: 'Smart prioritization', desc: 'AI-assisted urgency ranking for your backlog' },
  { icon: '🔐', label: 'Role-based access', desc: 'Admin and member roles with granular controls' },
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)]">

      {/* ── Left: Form ──────────────────────────────────── */}
      <div className="w-full lg:w-[46%] flex flex-col justify-center px-8 sm:px-14 md:px-20 py-12 relative z-10">
        {/* Logo */}
        <div className="mb-12 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-glow">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold font-display tracking-tight">TaskFlow</span>
          <span className="ml-1 tag" style={{background:'rgba(99,102,241,.15)', color:'var(--accent-2)', fontSize:10}}>BETA</span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* ── Right: Brand panel ──────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d22] via-[#10102a] to-[#0a0a1a]" />
        
        {/* Animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--accent)] opacity-[.12] blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600 opacity-[.09] blur-3xl animate-blob [animation-delay:3s]" />
        <div className="absolute top-3/4 left-1/3 w-56 h-56 rounded-full bg-blue-500 opacity-[.07] blur-3xl animate-blob [animation-delay:6s]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[.04]"
          style={{backgroundImage:'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize:'40px 40px'}} />

        {/* Content */}
        <div className="relative z-10 px-16 max-w-xl">
          <div className="mb-8">
            <span className="tag" style={{background:'rgba(99,102,241,.15)', color:'var(--accent-2)', marginBottom:16, display:'inline-flex'}}>
              ✦ PRODUCTIVITY PLATFORM
            </span>
            <h2 className="font-display text-5xl font-bold leading-tight mt-4 mb-4" style={{letterSpacing:'-.03em'}}>
              Your team's work,<br />
              <span className="gradient-text">beautifully organized.</span>
            </h2>
            <p className="text-[var(--text-2)] text-base leading-relaxed">
              TaskFlow brings clarity to complex projects — from solo sprints to full team coordination.
            </p>
          </div>

          <div className="space-y-4 mt-10">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl"
                style={{background:'rgba(255,255,255,.035)', border:'1px solid rgba(255,255,255,.07)'}}>
                <span className="text-xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-semibold text-[var(--text)] text-sm">{f.label}</p>
                  <p className="text-[var(--text-3)] text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['#6366f1','#10b981','#f59e0b','#a855f7'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg)] flex items-center justify-center text-xs font-bold text-white"
                  style={{background: c}}>
                  {['A','M','J','P'][i]}
                </div>
              ))}
            </div>
            <p className="text-[var(--text-3)] text-xs">Trusted by <span className="text-[var(--text-2)] font-semibold">4,200+</span> teams worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
