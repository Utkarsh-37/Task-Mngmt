import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiHash, FiUser, FiCheckSquare, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_ACTIONS = [
  { id: 'nav-dashboard', label: 'Go to Dashboard', icon: FiHome, type: 'nav', path: '/dashboard' },
  { id: 'nav-tasks',     label: 'Go to Tasks',     icon: FiCheckSquare, type: 'nav', path: '/tasks' },
  { id: 'nav-profile',   label: 'Go to Profile',   icon: FiUser, type: 'nav', path: '/profile' },
];

const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return QUICK_ACTIONS;
    const q = query.toLowerCase();
    return QUICK_ACTIONS.filter(a => a.label.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (item) => {
    if (item.path) navigate(item.path);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const h = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c+1, results.length-1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c-1, 0)); }
      if (e.key === 'Enter' && results[cursor]) { e.preventDefault(); handleSelect(results[cursor]); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, cursor, results]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          transition={{duration:.15}}
          className="cmd-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{opacity:0, scale:.95, y:-8}}
            animate={{opacity:1, scale:1, y:0}}
            exit={{opacity:0, scale:.95, y:-8}}
            transition={{duration:.18}}
            onClick={e => e.stopPropagation()}
            style={{
              width:'100%', maxWidth:540,
              background:'var(--surface)',
              border:'1px solid var(--border-2)',
              borderRadius:16,
              boxShadow:'0 32px 80px rgba(0,0,0,.65)',
              overflow:'hidden',
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5" style={{borderBottom:'1px solid var(--border)'}}>
              <FiSearch size={15} style={{color:'var(--text-3)', flexShrink:0}} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setCursor(0); }}
                placeholder="Search tasks, navigate, run actions…"
                style={{
                  flex:1, background:'none', border:'none', outline:'none',
                  color:'var(--text)', fontSize:14, fontFamily:'var(--font-body)',
                }}
              />
              <kbd style={{
                padding:'2px 7px', borderRadius:6, fontSize:11, fontFamily:'monospace',
                background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)',
                color:'var(--text-3)', flexShrink:0,
              }}>ESC</kbd>
            </div>

            {/* Results */}
            <div className="p-2 max-h-[360px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="empty-state py-10">
                  <FiHash size={24} />
                  <p>No results for "{query}"</p>
                </div>
              ) : (
                <>
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1"
                    style={{color:'var(--text-3)'}}>
                    {query ? 'Results' : 'Quick actions'}
                  </p>
                  {results.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[9px] text-left transition-colors"
                      style={{
                        background: cursor === i ? 'var(--accent-glow)' : 'transparent',
                        border: cursor === i ? '1px solid rgba(99,102,241,.25)' : '1px solid transparent',
                        color: cursor === i ? 'var(--accent-2)' : 'var(--text-2)',
                      }}
                      onMouseEnter={() => setCursor(i)}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{background: cursor===i ? 'rgba(99,102,241,.2)' : 'var(--surface-2)'}}>
                        <item.icon size={13} />
                      </div>
                      <span className="text-[13px] font-medium">{item.label}</span>
                      {cursor === i && (
                        <span className="ml-auto text-[11px] opacity-60">↵ Open</span>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2.5 flex items-center gap-4" style={{borderTop:'1px solid var(--border)'}}>
              {[['↑↓','Navigate'],['↵','Select'],['ESC','Close']].map(([k,v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <kbd style={{padding:'1px 5px',borderRadius:4,fontSize:10,fontFamily:'monospace',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'var(--text-3)'}}>
                    {k}
                  </kbd>
                  <span style={{fontSize:11,color:'var(--text-3)'}}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
