import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Suspense, lazy } from 'react';

import AuthLayout  from '../layouts/AuthLayout';
import MainLayout  from '../layouts/MainLayout';

// Lazy-load pages for code splitting
const Login     = lazy(() => import('../pages/auth/Login'));
const Register  = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Tasks     = lazy(() => import('../pages/tasks/Tasks'));
const Users     = lazy(() => import('../pages/users/Users'));
const Profile   = lazy(() => import('../pages/profile/Profile'));
const NotFound  = lazy(() => import('../pages/error/NotFound'));

/* ── Loading skeleton ──────────────────────────────── */
const PageLoader = () => (
  <div className="flex-1 p-7 space-y-5">
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-2">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-8 w-56 rounded" />
      </div>
      <div className="skeleton h-9 w-28 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-32 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="skeleton h-72 rounded-2xl lg:col-span-2" />
      <div className="skeleton h-72 rounded-2xl" />
    </div>
  </div>
);

/* ── Route guards ──────────────────────────────────── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  return user?.role === 'ADMIN' ? children : <Navigate to="/dashboard" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

/* ── AppRoutes ─────────────────────────────────────── */
const AppRoutes = () => (
  <Suspense fallback={
    <div className="h-screen flex" style={{ background: 'var(--bg)' }}>
      <div style={{ width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)' }} className="skeleton opacity-20" />
      <PageLoader />
    </div>
  }>
    <Routes>
      {/* Public auth routes */}
      <Route element={<PublicOnlyRoute><AuthLayout /></PublicOnlyRoute>}>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks"     element={<Tasks />} />
        <Route path="/profile"   element={<Profile />} />
        <Route path="/users"     element={<AdminRoute><Users /></AdminRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
