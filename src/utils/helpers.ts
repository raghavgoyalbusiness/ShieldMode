import { generateId } from './helpers';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${sec}s`;
}

export function stateLabel(state: string): string {
  const labels: Record<string, string> = {
    ready: 'Ready',
    triggered: 'Triggered',
    alerted: 'Alerts Sent',
    waiting: 'Waiting for Response',
    escalating: 'Escalating',
    responder_active: 'Responder Active',
    safe: 'Safe',
  };
  return labels[state] || state;
}

export function stateColor(state: string): string {
  const colors: Record<string, string> = {
    ready: 'text-green-600 dark:text-green-400',
    triggered: 'text-red-600 dark:text-red-400',
    alerted: 'text-amber-600 dark:text-amber-400',
    waiting: 'text-amber-600 dark:text-amber-400',
    escalating: 'text-red-600 dark:text-red-400',
    responder_active: 'text-blue-600 dark:text-blue-400',
    safe: 'text-green-600 dark:text-green-400',
  };
  return colors[state] || '';
}
