import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiMail, FiLock, FiLoader, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const schema = yup.object({
  email:    yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
}).required();

const InputField = ({ label, icon: Icon, error, type = 'text', placeholder, reg, rightEl }) => (
  <div>
    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={14} style={{ color: error ? 'var(--danger)' : 'var(--text-3)' }} />
      </div>
      <input
        {...reg}
        type={type}
        placeholder={placeholder}
        className={`input-base pl-9 ${error ? 'error' : ''} ${rightEl ? 'pr-10' : ''}`}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="flex items-center gap-1 mt-1.5 text-[11px]"
          style={{ color: 'var(--danger)' }}
        >
          <FiAlertCircle size={11} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28 }}>
      <div className="mb-8">
        <h1 className="font-display font-bold text-[1.85rem]" style={{ color: 'var(--text)', letterSpacing: '-.03em' }}>
          Welcome back
        </h1>
        <p className="mt-1.5 text-[13px]" style={{ color: 'var(--text-2)' }}>
          Sign in to continue to your workspace
        </p>
      </div>

      {/* API error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 p-3.5 rounded-xl mb-5 text-[13px]"
            style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', color: 'var(--danger)' }}
          >
            <FiAlertCircle size={14} style={{ flexShrink: 0 }} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Email address" icon={FiMail}
          error={errors.email?.message} type="email"
          placeholder="you@company.com" reg={register('email')}
        />
        <InputField
          label="Password" icon={FiLock}
          error={errors.password?.message}
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••" reg={register('password')}
          rightEl={
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
              {showPass ? <FiEyeOff size={13} /> : <FiEye size={13} />}
            </button>
          }
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 rounded accent-indigo-500" />
            <span className="text-[12px]" style={{ color: 'var(--text-2)' }}>Remember me</span>
          </label>
          <button type="button" className="text-[12px]" style={{ color: 'var(--accent-2)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Forgot password?
          </button>
        </div>

        <button
          type="submit" disabled={loading}
          className="btn btn-primary w-full mt-2"
          style={{ height: 42, fontSize: 14, opacity: loading ? .7 : 1 }}
        >
          {loading ? <><FiLoader size={14} className="animate-spin-slow" /> Signing in…</> : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px]" style={{ color: 'var(--text-3)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--accent-2)', fontWeight: 600 }}>
          Create one free
        </Link>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>OR CONTINUE WITH</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* SSO stubs */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Google', icon: '🔵' },
          { label: 'GitHub', icon: '⚫' },
        ].map(({ label, icon }) => (
          <button key={label} className="btn btn-ghost justify-center" style={{ height: 40 }}>
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Login;
