import { Outlet } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import CommandPalette from '../components/ui/CommandPalette';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive: collapse sidebar on mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ⌘K shortcut
  const handleKeydown = useCallback(e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCmdOpen(v => !v);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  return (
    <div className="h-screen flex overflow-hidden" style={{background:'var(--bg)'}}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          toggleSidebar={() => setSidebarOpen(v => !v)}
          onSearchOpen={() => setCmdOpen(true)}
        />

        <main className="flex-1 overflow-y-auto" style={{background:'var(--bg)'}}>
          {/* Subtle grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-[.025]"
            style={{backgroundImage:'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
          
          <div className="relative max-w-[1440px] mx-auto px-5 sm:px-7 py-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{opacity:0, y:6}}
                animate={{opacity:1, y:0}}
                exit={{opacity:0, y:-4}}
                transition={{duration:.2}}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
};

export default MainLayout;
