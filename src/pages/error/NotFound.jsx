import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center"
    style={{ background: 'var(--bg)', color: 'var(--text)' }}>

    {/* Blobs */}
    <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[.07]"
      style={{ background: 'var(--accent)' }} />
    <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-[.05]"
      style={{ background: 'var(--purple)' }} />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4 }}
      className="relative text-center px-6 max-w-lg"
    >
      {/* 404 */}
      <div className="font-display font-black mb-4 leading-none select-none"
        style={{
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          background: 'linear-gradient(135deg, var(--border-2) 0%, var(--border) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-.05em',
        }}>
        404
      </div>

      <h1 className="font-display font-bold text-[1.75rem] mb-3" style={{ color: 'var(--text)', letterSpacing: '-.03em' }}>
        Page not found
      </h1>
      <p className="text-[14px] mb-8 leading-relaxed" style={{ color: 'var(--text-3)' }}>
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => window.history.back()} className="btn btn-ghost">
          <FiArrowLeft size={14} /> Go back
        </button>
        <Link to="/dashboard">
          <button className="btn btn-primary">
            <FiHome size={14} /> Dashboard
          </button>
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
