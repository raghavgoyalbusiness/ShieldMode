import { stateLabel, stateColor } from '../utils/helpers';
import type { AlertState } from '../types';

export function StatusBadge({ state }: { state: AlertState }) {
  const bgMap: Record<string, string> = {
    ready: 'bg-green-100 dark:bg-green-900/30',
    triggered: 'bg-red-100 dark:bg-red-900/30',
    alerted: 'bg-amber-100 dark:bg-amber-900/30',
    waiting: 'bg-amber-100 dark:bg-amber-900/30',
    escalating: 'bg-red-100 dark:bg-red-900/30',
    responder_active: 'bg-blue-100 dark:bg-blue-900/30',
    safe: 'bg-green-100 dark:bg-green-900/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${bgMap[state]} ${stateColor(state)}`}>
      <span className={`w-2 h-2 rounded-full ${state === 'ready' || state === 'safe' ? 'bg-green-500' : state === 'triggered' || state === 'escalating' ? 'bg-red-500' : state === 'responder_active' ? 'bg-blue-500' : 'bg-amber-500'}`} />
      {stateLabel(state)}
    </span>
  );
}
