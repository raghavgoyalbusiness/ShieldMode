import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Home, Clock, Settings, Radio } from 'lucide-react';
import { useShieldStore } from '../store/useShieldStore';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/alert', icon: Radio, label: 'Alert' },
  { path: '/log', icon: Clock, label: 'Log' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { alertState, settings } = useShieldStore();
  const isActive = alertState !== 'ready' && alertState !== 'safe';

  return (
    <div className="flex flex-col h-full bg-[var(--color-shield-bg)]">
      <header className="flex items-center justify-between px-4 py-3 bg-[var(--color-shield-surface)] border-b border-[var(--color-shield-border)]">
        <div className="flex items-center gap-2">
          <Shield className={`w-6 h-6 ${isActive ? 'text-red-500' : 'text-green-500'}`} />
          <span className="font-bold text-lg text-[var(--color-shield-text)]">ShieldMode</span>
        </div>
        <div className="flex items-center gap-2">
          {settings.demoMode && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              DEMO
            </span>
          )}
          {isActive && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <nav className="flex items-center justify-around bg-[var(--color-shield-surface)] border-t border-[var(--color-shield-border)] pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2.5 px-4 min-w-[64px] tap-highlight-transparent transition-colors ${
                active
                  ? 'text-[var(--color-shield-text)]'
                  : 'text-[var(--color-shield-text-muted)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
              {path === '/alert' && isActive && (
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
