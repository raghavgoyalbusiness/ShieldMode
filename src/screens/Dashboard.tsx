import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Zap, AlertTriangle } from 'lucide-react';
import { useShieldStore } from '../store/useShieldStore';
import { SOSButton } from '../components/SOSButton';
import { ContactCard } from '../components/ContactCard';
import { StatusBadge } from '../components/StatusBadge';

export function Dashboard() {
  const { alertState, contacts, settings, triggerSOS } = useShieldStore();
  const navigate = useNavigate();
  const handleTrigger = () => { triggerSOS(); navigate('/alert'); };
  const isReady = contacts.length > 0;
  const activeAlert = alertState !== 'ready' && alertState !== 'safe';
  return (
    <div className="flex flex-col items-center px-5 py-6 min-h-full">
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <StatusBadge state={alertState} />
          {settings.demoMode && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">DEMO MODE</span>}
        </div>
        {alertState === 'safe' && <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-4"><CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" /><p className="text-sm text-green-700 dark:text-green-300">You confirmed you're safe. Stay strong. 💚</p></div>}
        {activeAlert && <button onClick={() => navigate('/alert')} className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4 active:scale-[0.98] transition-transform"><AlertTriangle className="w-5 h-5 text-red-500" /><div className="flex-1 text-left"><div className="font-semibold text-red-700 dark:text-red-300">Alert Active</div><div className="text-sm text-red-600/80 dark:text-red-400/80">Tap to view live status</div></div></button>}
      </div>
      <div className="w-full mb-6 p-4 rounded-xl bg-[var(--color-shield-surface)] border border-[var(--color-shield-border)]"><h3 className="font-semibold text-[var(--color-shield-text)] mb-3 flex items-center gap-2"><Zap className="w-4 h-4" />System Check</h3><div className="space-y-2">{[{ label: 'Emergency Contacts', ok: contacts.length > 0, detail: `${contacts.length}/3 configured` }, { label: 'Messaging Layer', ok: true, detail: 'Wingman bridge ready' }, { label: 'Emergency Video', ok: false, detail: 'Checking for support...' }, { label: 'Location Services', ok: true, detail: 'Available (mocked)' }].map((item, i) => (<div key={i} className="flex items-center justify-between py-1.5"><span className="text-sm text-[var(--color-shield-text)]">{item.label}</span><span className={`text-xs font-medium ${item.ok ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>{item.detail}</span></div>))}</div></div>
      <div className="flex-1 flex items-center justify-center my-4"><SOSButton onPress={handleTrigger} disabled={!isReady || activeAlert} /></div>
      <div className="w-full mt-4"><h3 className="font-semibold text-[var(--color-shield-text)] mb-2 flex items-center gap-2"><Users className="w-4 h-4" />Trusted Contacts</h3><div className="space-y-2">{contacts.map(c => (<ContactCard key={c.id} contact={c} compact />))}{contacts.length === 0 && <p className="text-sm text-[var(--color-shield-text-muted)] py-4 text-center">No contacts configured. Go to Settings to add contacts.</p>}</div></div>
    </div>
  );
}
