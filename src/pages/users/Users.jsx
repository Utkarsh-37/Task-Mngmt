import { useState, useMemo } from 'react';
import {
  FiSearch, FiMoreVertical, FiUserPlus, FiShield, FiUser,
  FiTrash2, FiEdit2, FiCheckCircle, FiXCircle, FiMail,
  FiFilter, FiDownload, FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRef, useEffect } from 'react';

const INITIAL_USERS = [
  { _id: '1', name: 'Admin User',   email: 'admin@system.com',    role: 'ADMIN',  tasks: 5,  status: 'active',   joined: '2024-01-12', avatar: '#6366f1' },
  { _id: '2', name: 'Sarah Lee',    email: 'sarah@example.com',   role: 'USER',   tasks: 12, status: 'active',   joined: '2024-02-20', avatar: '#10b981' },
  { _id: '3', name: 'Marcus Kim',   email: 'marcus@example.com',  role: 'USER',   tasks: 3,  status: 'active',   joined: '2024-03-05', avatar: '#f59e0b' },
  { _id: '4', name: 'Julia Chen',   email: 'julia@example.com',   role: 'USER',   tasks: 8,  status: 'inactive', joined: '2024-03-18', avatar: '#a855f7' },
  { _id: '5', name: 'Pablo Rios',   email: 'pablo@example.com',   role: 'USER',   tasks: 6,  status: 'active',   joined: '2024-04-02', avatar: '#ef4444' },
  { _id: '6', name: 'Diana Patel',  email: 'diana@example.com',   role: 'ADMIN',  tasks: 14, status: 'active',   joined: '2024-04-15', avatar: '#06b6d4' },
];

const ROLE_STYLE = {
  ADMIN: { bg: 'rgba(168,85,247,.12)', color: '#c084fc', icon: FiShield },
  USER:  { bg: 'rgba(99,102,241,.1)',  color: '#a5b4fc', icon: FiUser  },
};

const STATUS_STYLE = {
  active:   { bg: 'rgba(16,185,129,.1)',  color: '#34d399', dot: '#10b981' },
  inactive: { bg: 'rgba(100,100,120,.12)', color: '#888',    dot: '#555' },
};

/* ── Row-level actions dropdown ─────────────────────── */
const ActionsMenu = ({ user, onDelete, onToggleRole, onToggleStatus }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ width: 30, height: 30 }}
      >
        <FiMoreVertical size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: .94, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .94 }}
            transition={{ duration: .12 }}
            className="dropdown-menu absolute right-0 top-8 z-30"
            style={{ minWidth: 190 }}
          >
            <button className="dropdown-item w-full" onClick={() => { onToggleRole(user._id); setOpen(false); }}>
              <FiShield size={12} />
              {user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
            </button>
            <button className="dropdown-item w-full" onClick={() => { toast.success(`Email sent to ${user.name}`); setOpen(false); }}>
              <FiMail size={12} /> Send email
            </button>
            <button className="dropdown-item w-full" onClick={() => { onToggleStatus(user._id); setOpen(false); }}>
              {user.status === 'active'
                ? <><FiXCircle size={12} /> Deactivate</>
                : <><FiCheckCircle size={12} /> Reactivate</>}
            </button>
            <div className="dropdown-divider" />
            <button className="dropdown-item danger w-full" onClick={() => { onDelete(user._id); setOpen(false); }}>
              <FiTrash2 size={12} /> Delete user
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Invite modal ─────────────────────────────────── */
const InviteModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!email) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 700));
    setSending(false);
    toast.success(`Invite sent to ${email}`);
    setEmail(''); onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop" onClick={onClose} />
          <div className="modal-backdrop" style={{ pointerEvents: 'none', zIndex: 501 }}>
            <motion.div
              initial={{ opacity: 0, scale: .95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .95 }}
              transition={{ duration: .18 }}
              className="modal-panel"
              style={{ maxWidth: 440, pointerEvents: 'all', position: 'relative', zIndex: 501 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h2 className="font-display font-bold text-[16px]" style={{ color: 'var(--text)' }}>Invite teammate</h2>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-3)' }}>They'll receive an email invite link</p>
                </div>
                <button className="btn-icon" onClick={onClose}><FiXCircle size={15} /></button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Email address</label>
                  <div className="relative">
                    <FiMail size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="input-base pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['USER', 'ADMIN'].map(r => {
                      const rs = ROLE_STYLE[r];
                      return (
                        <button key={r} onClick={() => setRole(r)}
                          className="flex flex-col items-start p-3 rounded-xl transition-all text-left"
                          style={{
                            border: `2px solid ${role === r ? 'var(--accent)' : 'var(--border)'}`,
                            background: role === r ? 'var(--accent-glow)' : 'var(--surface-2)',
                          }}>
                          <rs.icon size={14} style={{ color: rs.color, marginBottom: 6 }} />
                          <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{r}</span>
                          <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                            {r === 'ADMIN' ? 'Full access' : 'Standard access'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleInvite} disabled={sending || !email}
                  style={{ opacity: sending || !email ? .6 : 1 }}>
                  {sending ? '⟳ Sending…' : <><FiMail size={13} /> Send invite</>}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Main Users page ──────────────────────────────── */
const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const handleDelete = (id) => {
    setUsers(u => u.filter(x => x._id !== id));
    toast.success('User removed');
  };

  const handleToggleRole = (id) => {
    setUsers(u => u.map(x => x._id === id
      ? { ...x, role: x.role === 'ADMIN' ? 'USER' : 'ADMIN' }
      : x));
    toast.success('Role updated');
  };

  const handleToggleStatus = (id) => {
    setUsers(u => u.map(x => x._id === id
      ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' }
      : x));
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let list = [...users];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== 'All') list = list.filter(u => u.role === roleFilter);
    if (statusFilter !== 'All') list = list.filter(u => u.status === statusFilter);
    list.sort((a, b) => {
      const av = a[sortBy] ?? '';
      const bv = b[sortBy] ?? '';
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [users, search, roleFilter, statusFilter, sortBy, sortDir]);

  const SortIcon = ({ col }) => (
    <span style={{ opacity: sortBy === col ? 1 : 0.3, fontSize: 10, marginLeft: 4 }}>
      {sortBy === col && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  );

  const TH = ({ col, label, className = '' }) => (
    <th
      onClick={() => handleSort(col)}
      className={`px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${className}`}
      style={{ color: sortBy === col ? 'var(--accent-2)' : 'var(--text-3)' }}
    >
      {label}<SortIcon col={col} />
    </th>
  );

  const activeCount   = users.filter(u => u.status === 'active').length;
  const adminCount    = users.filter(u => u.role === 'ADMIN').length;
  const totalTasks    = users.reduce((s, u) => s + u.tasks, 0);

  return (
    <div className="pb-8">

      {/* ── Page header ───────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-display font-bold text-[1.75rem]" style={{ color: 'var(--text)', letterSpacing: '-.03em' }}>
            Team Members
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-2)' }}>
            {users.length} members · {adminCount} admins · {activeCount} active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Exported team list')}>
            <FiDownload size={13} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => setInviteOpen(true)}>
            <FiUserPlus size={14} /> Invite member
          </button>
        </div>
      </motion.div>

      {/* ── Stats strip ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total members', value: users.length, color: 'var(--accent)' },
          { label: 'Active',        value: activeCount,  color: 'var(--success)' },
          { label: 'Admins',        value: adminCount,   color: 'var(--purple)' },
          { label: 'Total tasks',   value: totalTasks,   color: 'var(--warning)' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)' }}>
              {s.label}
            </p>
            <p className="font-display font-bold text-[1.8rem]" style={{ color: s.color, letterSpacing: '-.03em' }}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Filters ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="input-base pl-9" style={{ paddingTop: 8, paddingBottom: 8 }}
          />
        </div>

        {/* Role filter */}
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="input-base w-auto" style={{ width: 'auto', minWidth: 140, cursor: 'pointer' }}>
          <option value="All">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>

        {/* Status filter */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="input-base w-auto" style={{ width: 'auto', minWidth: 140, cursor: 'pointer' }}>
          <option value="All">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {(search || roleFilter !== 'All' || statusFilter !== 'All') && (
          <button className="btn btn-ghost btn-sm"
            onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); }}>
            <FiRefreshCw size={12} /> Reset
          </button>
        )}
      </div>

      {/* ── Table ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <tr>
                <TH col="name"   label="Member" />
                <TH col="role"   label="Role" className="hidden sm:table-cell" />
                <TH col="status" label="Status" className="hidden md:table-cell" />
                <TH col="tasks"  label="Tasks" className="hidden lg:table-cell" />
                <TH col="joined" label="Joined" className="hidden xl:table-cell" />
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-3)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <FiUser size={28} />
                        <h4>No members found</h4>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, i) => {
                    const rs = ROLE_STYLE[user.role];
                    const ss = STATUS_STYLE[user.status];
                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        transition={{ delay: i * 0.04 }}
                        className="group transition-colors"
                        style={{ borderBottom: '1px solid var(--border)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Member */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                              style={{ background: user.avatar }}>
                              {user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[13px] truncate" style={{ color: 'var(--text)' }}>
                                {user.name}
                              </p>
                              <p className="text-[11px] truncate" style={{ color: 'var(--text-3)' }}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className="tag flex items-center gap-1.5 w-fit"
                            style={{ background: rs.bg, color: rs.color }}>
                            <rs.icon size={10} />
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className="flex items-center gap-1.5 text-[12px] font-medium"
                            style={{ color: ss.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ss.dot }} />
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>

                        {/* Tasks */}
                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[13px]" style={{ color: 'var(--text)' }}>
                              {user.tasks}
                            </span>
                            <div className="progress-bar flex-1 max-w-[64px]">
                              <div className="progress-fill"
                                style={{ width: `${Math.min(user.tasks * 6, 100)}%`, background: 'var(--accent)' }} />
                            </div>
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-3.5 hidden xl:table-cell">
                          <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                            {new Date(user.joined).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <ActionsMenu
                            user={user}
                            onDelete={handleDelete}
                            onToggleRole={handleToggleRole}
                            onToggleStatus={handleToggleStatus}
                          />
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer pagination hint */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
              Showing {filtered.length} of {users.length} members
            </p>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-sm" disabled style={{ opacity: .4 }}>← Prev</button>
              <span className="px-3 py-1 rounded-lg text-[12px] font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}>1</span>
              <button className="btn btn-ghost btn-sm" disabled style={{ opacity: .4 }}>Next →</button>
            </div>
          </div>
        )}
      </motion.div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
};

export default Users;
