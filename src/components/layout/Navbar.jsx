import { FiSearch, FiBell, FiMenu, FiMoon, FiSun, FiCommand, FiSettings } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PAGE_TITLES = {
  '/dashboard': { label: 'Dashboard', crumbs: [] },
  '/tasks':     { label: 'Tasks',     crumbs: ['Workspace'] },
  '/users':     { label: 'Team',      crumbs: ['Admin'] },
  '/profile':   { label: 'Profile',   crumbs: ['Account'] },
};

const MOCK_NOTIFS = [
  { id:1, text: 'Alex assigned you a task', sub: 'Fix login redirect bug', time: '2m ago', dot: 'var(--accent)' },
  { id:2, text: 'Design system audit is due', sub: 'Due today at 5 PM', time: '1h ago', dot: 'var(--warning)' },
  { id:3, text: 'Maria commented on your task', sub: '"Looks great, just one change…"', time: '3h ago', dot: 'var(--success)' },
];

const Navbar = ({ toggleSidebar, onSearchOpen }) => {
  const location = useLocation();
  const { user } = useSelector(s => s.auth);
  const [isDark, setIsDark] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [unread] = useState(2);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const page = PAGE_TITLES[location.pathname] || { label: 'TaskFlow', crumbs: [] };
  const initials = user?.name
    ? user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
    : 'AU';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Close dropdowns on outside click
  useEffect(() => {
    const h = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header className="h-[58px] flex items-center justify-between px-5 shrink-0 z-20"
      style={{background:'var(--surface)', borderBottom:'1px solid var(--border)'}}>

      {/* ── Left ──────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={toggleSidebar} className="btn-icon md:hidden" aria-label="Menu">
          <FiMenu size={16} />
        </button>

        {/* Breadcrumb */}
        <nav className="breadcrumb hidden sm:flex">
          <span>Workspace</span>
          {page.crumbs.map(c => (
            <span key={c} className="flex items-center gap-1">
              <span className="breadcrumb-sep">/</span>
              <span>{c}</span>
            </span>
          ))}
          <span className="flex items-center gap-1">
            <span className="breadcrumb-sep">/</span>
            <span style={{color:'var(--text-2)'}}>{page.label}</span>
          </span>
        </nav>
      </div>

      {/* ── Center: Search trigger ─────────────────── */}
      <button
        onClick={onSearchOpen}
        className="hidden sm:flex items-center gap-2.5 mx-4 px-4 h-9 rounded-[10px] text-[13px] transition-all duration-150 flex-1 max-w-xs"
        style={{
          background: 'var(--surface-2)',
          border: '1.5px solid var(--border)',
          color: 'var(--text-3)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <FiSearch size={13} />
        <span className="flex-1 text-left">Search tasks…</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-mono"
            style={{background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)'}}>
            ⌘K
          </kbd>
        </span>
      </button>

      {/* ── Right ─────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <button onClick={() => setIsDark(!isDark)} className="btn-icon" title="Toggle theme">
          {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button className="btn-icon relative" onClick={() => setShowNotifs(!showNotifs)} title="Notifications">
            <FiBell size={15} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{background:'var(--danger)', border:'1.5px solid var(--surface)'}}>
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="dropdown-menu absolute right-0 top-10 w-[320px] z-50">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-xs font-semibold" style={{color:'var(--text-2)'}}>Notifications</span>
                <button className="text-[11px]" style={{color:'var(--accent-2)'}}>Mark all read</button>
              </div>
              {MOCK_NOTIFS.map(n => (
                <button key={n.id} className="dropdown-item w-full text-left flex-col items-start gap-0.5 py-3">
                  <div className="flex items-center gap-2 w-full">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background: n.dot}} />
                    <span className="text-[12px] font-medium flex-1" style={{color:'var(--text)'}}>{n.text}</span>
                    <span className="text-[10px]" style={{color:'var(--text-3)'}}>{n.time}</span>
                  </div>
                  <p className="text-[11px] pl-3.5" style={{color:'var(--text-3)'}}>{n.sub}</p>
                </button>
              ))}
              <div className="dropdown-divider" />
              <button className="dropdown-item justify-center text-[12px]" style={{color:'var(--accent-2)'}}>
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative ml-1" ref={userRef}>
          <button
            onClick={() => setShowUser(!showUser)}
            className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-[10px] transition-all"
            style={{background: showUser ? 'var(--surface-2)' : 'transparent', border:'1.5px solid transparent'}}
            onMouseEnter={e => { if(!showUser) e.currentTarget.style.background='var(--surface-2)'; }}
            onMouseLeave={e => { if(!showUser) e.currentTarget.style.background='transparent'; }}
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{background:'linear-gradient(135deg, var(--accent), var(--purple))'}}>
              {initials}
            </div>
            <span className="text-[12px] font-medium hidden sm:block" style={{color:'var(--text-2)'}}>
              {user?.name?.split(' ')[0] || 'Admin'}
            </span>
          </button>

          {showUser && (
            <div className="dropdown-menu absolute right-0 top-10 z-50">
              <div className="px-3 py-2 mb-1">
                <p className="text-[13px] font-semibold" style={{color:'var(--text)'}}>{user?.name || 'Admin User'}</p>
                <p className="text-[11px]" style={{color:'var(--text-3)'}}>{user?.email || 'admin@system.com'}</p>
              </div>
              <div className="dropdown-divider" />
              <Link to="/profile" onClick={() => setShowUser(false)}>
                <button className="dropdown-item w-full">
                  <FiSettings size={13} /> Account settings
                </button>
              </Link>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger w-full" onClick={() => {}}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
