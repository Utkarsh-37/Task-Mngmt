import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiUser, FiMail, FiLock, FiLoader, FiAlertCircle, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const schema = yup.object({
  name:     yup.string().min(2, 'At least 2 characters').required('Full name is required'),
  email:    yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirm:  yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Please confirm'),
}).required();

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '6+ characters', pass: password?.length >= 6 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password || '') },
    { label: 'Number', pass: /\d/.test(password || '') },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['var(--danger)', 'var(--warning)', 'var(--success)'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score - 1] : 'var(--border-2)' }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className="flex items-center gap-1 text-[10px]"
              style={{ color: c.pass ? 'var(--success)' : 'var(--text-3)' }}>
              <FiCheckCircle size={9} />
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className="text-[11px] font-semibold" style={{ color: colors[score - 1] }}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [showPass, setShowPass] = useState(false);
  const [watchPass, setWatchPass] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const sub = watch(v => setWatchPass(v.password || ''));
    return () => sub.unsubscribe();
  }, [watch]);

  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const { confirm, ...rest } = data;
    const result = await dispatch(registerUser(rest));
    if (registerUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28 }}>
      <div className="mb-7">
        <h1 className="font-display font-bold text-[1.85rem]" style={{ color: 'var(--text)', letterSpacing: '-.03em' }}>
          Create your account
        </h1>
        <p className="mt-1.5 text-[13px]" style={{ color: 'var(--text-2)' }}>
          Free forever. No credit card required.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 p-3.5 rounded-xl mb-5 text-[13px]"
            style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', color: 'var(--danger)' }}
          >
            <FiAlertCircle size={14} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full name */}
        <div>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Full name</label>
          <div className="relative">
            <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input {...register('name')} type="text" placeholder="Jane Smith"
              className={`input-base pl-9 ${errors.name ? 'error' : ''}`} />
          </div>
          {errors.name && (
            <p className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: 'var(--danger)' }}>
              <FiAlertCircle size={11} /> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Email address</label>
          <div className="relative">
            <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input {...register('email')} type="email" placeholder="you@company.com"
              className={`input-base pl-9 ${errors.email ? 'error' : ''}`} />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: 'var(--danger)' }}>
              <FiAlertCircle size={11} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Password</label>
          <div className="relative">
            <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
              className={`input-base pl-9 pr-10 ${errors.password ? 'error' : ''}`} />
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {showPass ? <FiEyeOff size={13} /> : <FiEye size={13} />}
            </button>
          </div>
          <PasswordStrength password={watchPass} />
          {errors.password && (
            <p className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: 'var(--danger)' }}>
              <FiAlertCircle size={11} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Confirm password</label>
          <div className="relative">
            <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input {...register('confirm')} type="password" placeholder="Re-enter password"
              className={`input-base pl-9 ${errors.confirm ? 'error' : ''}`} />
          </div>
          {errors.confirm && (
            <p className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: 'var(--danger)' }}>
              <FiAlertCircle size={11} /> {errors.confirm.message}
            </p>
          )}
        </div>

        <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>
          By creating an account you agree to our{' '}
          <span style={{ color: 'var(--accent-2)', cursor: 'pointer' }}>Terms of Service</span>{' '}
          and{' '}
          <span style={{ color: 'var(--accent-2)', cursor: 'pointer' }}>Privacy Policy</span>.
        </p>

        <button type="submit" disabled={loading}
          className="btn btn-primary w-full"
          style={{ height: 42, fontSize: 14, opacity: loading ? .7 : 1 }}>
          {loading
            ? <><FiLoader size={14} className="animate-spin-slow" /> Creating account…</>
            : 'Create free account'}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px]" style={{ color: 'var(--text-3)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </motion.div>
  );
};

export default Register;
