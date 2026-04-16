import { User, Phone, MessageCircle, Send, CheckCircle, Navigation } from 'lucide-react';
import type { Contact } from '../types';

const channelIcon: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle className="w-4 h-4 text-green-500" />,
  telegram: <Send className="w-4 h-4 text-blue-500" />,
  sms: <Phone className="w-4 h-4 text-gray-500" />,
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  none: { label: 'No response', color: 'text-[var(--color-shield-text-muted)]', icon: null },
  acknowledged: { label: 'Acknowledged', color: 'text-amber-500', icon: <CheckCircle className="w-4 h-4" /> },
  calling: { label: 'CALLING', color: 'text-green-600 dark:text-green-400', icon: <Phone className="w-4 h-4" /> },
  on_my_way: { label: 'ON MY WAY', color: 'text-blue-600 dark:text-blue-400', icon: <Navigation className="w-4 h-4" /> },
};

export function ContactCard({ contact, compact }: { contact: Contact; compact?: boolean }) {
  const status = statusConfig[contact.responseStatus || 'none'];
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-shield-surface)] border border-[var(--color-shield-border)]">
        <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
          <User className="w-4 h-4 text-[var(--color-shield-text-muted)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[var(--color-shield-text)] truncate">{contact.name}</div>
          <div className="flex items-center gap-1">
            {channelIcon[contact.channel]}
            <span className="text-xs text-[var(--color-shield-text-muted)]">{contact.phone}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-shield-surface)] border border-[var(--color-shield-border)]">
      <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0">
        <User className="w-5 h-5 text-[var(--color-shield-text-muted)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[var(--color-shield-text)] truncate">{contact.name}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {channelIcon[contact.channel]}
          <span className="text-sm text-[var(--color-shield-text-muted)]">{contact.phone}</span>
        </div>
      </div>
      {contact.responseStatus && contact.responseStatus !== 'none' && (
        <div className={`flex items-center gap-1 ${status.color}`}>
          {status.icon}
          <span className="text-xs font-semibold">{status.label}</span>
        </div>
      )}
    </div>
  );
}
