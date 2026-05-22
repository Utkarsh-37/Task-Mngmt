import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiSave, FiCamera, FiShield, FiBell, FiMonitor, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile',   label: 'Profile',         icon: FiUser },
  { id: 'security',  label: 'Security',         icon: FiShield },
  { id: 'notifs',    label: 'Notifications',    icon: FiBell },
  { id: 'appear',    label: 'Appearance',       icon: FiMonitor },
];

const SectionCard = ({ title, desc, children }) => (
  <div className="card overflow-hidden mb-5">
    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <h3 className="font-display font-semibold text-[15px]" style={{ color: 'var(--text)' }}>{title}</h3>
      {desc && <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-3)' }}>{desc}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InputRow = ({ label, desc, icon: Icon, ...props }) => (
  <div>
    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>{label}</label>
    {desc && <p className="text-[11px] mb-2" style={{ color: 'var(--text-3)' }}>{desc}</p>}
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />}
      <input className={`input-base ${Icon ? 'pl-9' : ''}`} {...props} />
    </div>
  </div>
);

const Toggle = ({ label, desc, checked, onChange }) => (
  <div className="flex items-start justify-between py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
    <div className="flex-1 pr-4">
      <p className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{label}</p>
      {desc && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className="relative shrink-0 w-10 h-5 rounded-full transition-all duration-200 mt-0.5"
      style={{ background: checked ? 'var(--accent)' : 'var(--border-2)', boxShadow: checked ? '0 0 10px rgba(99,102,241,.35)' : 'none' }}
    >
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: checked ? '22px' : '2px' }} />
    </button>
  </div>
);

const Profile = () => {
  const { user } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name || 'Admin User');
  const [notifs, setNotifs] = useState({ email: true, push: true, weekly: false, mentions: true });
  const [theme, setTheme] = useState('dark');

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('Changes saved successfully');
  };

  return (
    <div className="pb-8 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="font-display font-bold text-[1.75rem]" style={{ color: 'var(--text)', letterSpacing: '-.03em' }}>
          Account Settings
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-2)' }}>
          Manage your profile, security, and preferences
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-medium transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-3)',
            }}>
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ──────────────────────────── */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
          <SectionCard title="Your Identity" desc="This is how others see you across TaskFlow">
            {/* Avatar */}
            <div className="flex items-center gap-5 mb-7">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white font-display"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', boxShadow: '0 0 20px rgba(99,102,241,.3)' }}>
                  {initials}
                </div>
                <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--surface-3)', border: '2px solid var(--surface)', color: 'var(--text-2)' }}>
                  <FiCamera size={12} />
                </button>
              </div>
              <div>
                <p className="font-semibold text-[14px]" style={{ color: 'var(--text)' }}>{name}</p>
                <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>{user?.email || 'admin@system.com'}</p>
                <span className="tag mt-1" style={{ background: 'rgba(99,102,241,.12)', color: 'var(--accent-2)' }}>
                  {user?.role || 'ADMIN'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <InputRow label="Full Name" icon={FiUser} value={name} onChange={e => setName(e.target.value)} />
              <InputRow label="Email Address" icon={FiMail} defaultValue={user?.email || 'admin@system.com'} disabled
                style={{ opacity: .6, cursor: 'not-allowed' }} />
              <InputRow label="Job Title" placeholder="e.g., Product Manager" />
              <InputRow label="Location" placeholder="e.g., San Francisco, CA" />
            </div>

            <div className="mb-4">
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Bio</label>
              <textarea rows={3} placeholder="Tell your team a bit about yourself…"
                className="input-base resize-none" style={{ lineHeight: 1.6 }} />
            </div>

            <button onClick={handleSave} disabled={saving} className="btn btn-primary"
              style={{ opacity: saving ? .7 : 1 }}>
              {saving ? <><span className="animate-spin-slow inline-block">⟳</span> Saving…</> : <><FiSave size={13} /> Save changes</>}
            </button>
          </SectionCard>
        </motion.div>
      )}

      {/* ── Security Tab ─────────────────────────── */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
          <SectionCard title="Change Password" desc="Use a strong password you don't use elsewhere">
            <div className="space-y-4 max-w-sm">
              <InputRow label="Current Password" icon={FiLock} type="password" placeholder="••••••••" />
              <InputRow label="New Password" icon={FiLock} type="password" placeholder="Min. 6 characters" />
              <InputRow label="Confirm New Password" icon={FiLock} type="password" placeholder="Re-enter new password" />
              <button className="btn btn-primary btn-sm">Update password</button>
            </div>
          </SectionCard>

          <SectionCard title="Two-Factor Authentication" desc="Add an extra layer of security">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,.1)' }}>
                  <FiShield size={16} style={{ color: 'var(--success)' }} />
                </div>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>Authenticator app</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>Not configured</p>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">Enable 2FA</button>
            </div>
          </SectionCard>

          <SectionCard title="Active Sessions" desc="Devices currently signed into your account">
            {[
              { device: 'MacBook Pro — Chrome', location: 'Bengaluru, IN', time: 'Now', current: true },
              { device: 'iPhone 15 — Safari', location: 'Bengaluru, IN', time: '2 hours ago', current: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3"
                style={{ borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.current ? 'var(--success)' : 'var(--border-2)' }} />
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{s.device}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>{s.location} · {s.time}</p>
                  </div>
                </div>
                {!s.current && <button className="btn btn-danger btn-sm">Revoke</button>}
                {s.current && <span className="tag" style={{ background: 'rgba(16,185,129,.12)', color: 'var(--success)' }}>Current</span>}
              </div>
            ))}
          </SectionCard>
        </motion.div>
      )}

      {/* ── Notifications Tab ─────────────────────── */}
      {activeTab === 'notifs' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
          <SectionCard title="Email Notifications" desc="Choose when to receive email updates">
            <Toggle label="Task assignments" desc="When someone assigns a task to you" checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
            <Toggle label="Mentions" desc="When you're mentioned in a comment" checked={notifs.mentions} onChange={v => setNotifs(n => ({ ...n, mentions: v }))} />
            <Toggle label="Weekly digest" desc="A summary of activity every Monday" checked={notifs.weekly} onChange={v => setNotifs(n => ({ ...n, weekly: v }))} />
            <div className="mt-4">
              <button onClick={() => toast.success('Notification preferences saved')} className="btn btn-primary btn-sm">
                Save preferences
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Push Notifications" desc="Browser and mobile push alerts">
            <Toggle label="Enable push notifications" desc="Requires browser permission" checked={notifs.push} onChange={v => setNotifs(n => ({ ...n, push: v }))} />
          </SectionCard>
        </motion.div>
      )}

      {/* ── Appearance Tab ────────────────────────── */}
      {activeTab === 'appear' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
          <SectionCard title="Theme" desc="Choose your preferred color scheme">
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark', bg: '#08080f', border: '#272744', text: '#e8e8f5' },
                { id: 'light', label: 'Light', bg: '#f8fafc', border: '#e2e8f0', text: '#0f172a' },
                { id: 'system', label: 'System', bg: 'linear-gradient(135deg,#08080f 50%,#f8fafc 50%)', border: '#272744', text: '#888' },
              ].map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    border: `2px solid ${theme === t.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: 'var(--surface-2)',
                    boxShadow: theme === t.id ? '0 0 12px rgba(99,102,241,.25)' : 'none',
                  }}>
                  <div className="w-full h-10 rounded-lg mb-2" style={{ background: t.bg, border: `1px solid ${t.border}` }} />
                  <p className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>{t.label}</p>
                  {theme === t.id && (
                    <span className="flex items-center gap-1 text-[10px] mt-0.5" style={{ color: 'var(--accent-2)' }}>
                      <FiCheckCircle size={9} /> Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Sidebar" desc="Customize your navigation experience">
            <Toggle label="Collapsed by default" desc="Start with a compact sidebar on load" checked={false} onChange={() => {}} />
          </SectionCard>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
