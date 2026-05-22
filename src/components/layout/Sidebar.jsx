import { NavLink, Link } from 'react-router-dom';
import {
  FiHome, FiCheckSquare, FiUsers, FiUser, FiLogOut,
  FiChevronLeft, FiSettings, FiZap
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome, desc: 'Overview' },
    { name: 'Tasks',     path: '/tasks',     icon: FiCheckSquare, desc: 'All tasks' },
    ...(isAdmin ? [{ name: 'Users', path: '/users', icon: FiUsers, desc: 'Team' }] : []),
    { name: 'Profile',   path: '/profile',   icon: FiUser, desc: 'Account' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
    : 'AU';

  const W = isOpen ? 240 : 64;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <motion.aside
        initial={false}
        animate={{ width: W }}
        transition={{ duration: .22, ease: [.4,0,.2,1] }}
        className="flex flex-col h-full relative z-30 shrink-0 overflow-hidden"
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* ── Header ─────────────────────────────── */}
        <div className="h-[58px] flex items-center px-3 border-b shrink-0"
          style={{borderColor:'var(--border)'}}>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="logo"
                initial={{opacity:0, x:-8}}
                animate={{opacity:1, x:0}}
                exit={{opacity:0, x:-8}}
                transition={{duration:.18}}
                className="flex items-center gap-2.5 flex-1 overflow-hidden"
              >
                <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{background:'var(--accent)', boxShadow:'0 0 14px rgba(99,102,241,.35)'}}>
                    <FiZap size={15} color="#fff" />
                  </div>
                  <span className="font-display font-bold text-base whitespace-nowrap"
                    style={{color:'var(--text)'}}>
                    TaskFlow
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-icon shrink-0 ml-auto"
            aria-label="Toggle sidebar"
          >
            <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: .22 }}>
              <FiChevronLeft size={15} />
            </motion.div>
          </button>
        </div>

        {/* ── Nav items ──────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={!isOpen ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 group relative overflow-hidden ${
                  isActive ? 'nav-active' : 'hover:bg-[var(--surface-2)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={17}
                    style={{ color: isActive ? 'var(--accent-2)' : 'var(--text-2)', flexShrink: 0 }}
                    className="transition-colors duration-150"
                  />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{opacity:0, width:0}}
                        animate={{opacity:1, width:'auto'}}
                        exit={{opacity:0, width:0}}
                        transition={{duration:.18}}
                        className="overflow-hidden"
                      >
                        <span className="whitespace-nowrap text-[13px] font-medium"
                          style={{ color: isActive ? 'var(--accent-2)' : 'var(--text-2)' }}>
                          {item.name}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer ─────────────────────────────── */}
        <div className="p-2 border-t space-y-0.5" style={{borderColor:'var(--border)'}}>
          {/* User pill */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] mb-1"
                style={{background:'var(--surface-2)', border:'1px solid var(--border)'}}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{background:'linear-gradient(135deg, var(--accent), var(--purple))'}}>
                  {initials}
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-semibold truncate" style={{color:'var(--text)'}}>
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-[10px] truncate" style={{color:'var(--text-3)'}}>
                    {user?.role || 'ADMIN'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => dispatch(logout())}
            title={!isOpen ? 'Logout' : undefined}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-[10px] transition-all duration-150 group"
            style={{color:'var(--text-3)'}}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,.08)'; e.currentTarget.style.color='var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-3)'; }}
          >
            <FiLogOut size={16} style={{flexShrink:0}} />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{opacity:0, width:0}}
                  animate={{opacity:1, width:'auto'}}
                  exit={{opacity:0, width:0}}
                  transition={{duration:.18}}
                  className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
                >
                  Sign out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
