import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AlertState, Contact, IncidentLog, MessageLog, Settings } from '../types';
import { generateId } from '../utils/helpers';

interface ShieldStore {
  alertState: AlertState;
  contacts: Contact[];
  incidents: IncidentLog[];
  messages: MessageLog[];
  currentIncidentId: string | null;
  countdownSec: number;
  cancelCountdownSec: number;
  settings: Settings;
  darkMode: boolean;
  onboardingComplete: boolean;
  _timers: number[];
  setContacts: (contacts: Contact[]) => void;
  completeOnboarding: () => void;
  triggerSOS: () => void;
  cancelSOS: () => void;
  confirmSafe: () => void;
  resetToReady: () => void;
  simulateContactResponse: (contactId: string, keyword: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  toggleDarkMode: () => void;
  toggleDemoMode: () => void;
  clearIncidents: () => void;
  _advanceState: (next: AlertState) => void;
  _addMessage: (msg: Omit<MessageLog, 'id' | 'timestamp'>) => void;
  _startCancelCountdown: () => void;
  _startWaitingCountdown: () => void;
  _cleanup: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  escalationDelaySec: 60,
  cancelWindowSec: 5,
  initialTemplate: '🚨 EMERGENCY: {name} needs help immediately. This is an automated alert from ShieldMode. Please respond with CALLING or ON MY WAY.',
  escalationTemplate: '🔴 URGENT ESCALATION: {name} has not received a response. Immediate assistance required. Please call or go to their location NOW.',
  safeTemplate: '✅ {name} has confirmed they are safe. Thank you for responding. The alert has been resolved.',
  demoMode: false,
};

export const useShieldStore = create<ShieldStore>()(
  persist(
    (set, get) => ({
      alertState: 'ready',
      contacts: [],
      incidents: [],
      messages: [],
      currentIncidentId: null,
      countdownSec: 0,
      cancelCountdownSec: 0,
      settings: { ...DEFAULT_SETTINGS },
      darkMode: true,
      onboardingComplete: false,
      _timers: [],
      setContacts: (contacts) => set({ contacts }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      triggerSOS: () => {
        const state = get();
        if (state.alertState !== 'ready') return;
        const incidentId = generateId();
        const now = Date.now();
        const incident: IncidentLog = {
          id: incidentId,
          startTime: now,
          states: [{ state: 'triggered', timestamp: now }],
          contacts: state.contacts.map(c => ({ ...c, responseStatus: 'none' })),
          demoMode: state.settings.demoMode,
        };
        set({
          alertState: 'triggered',
          currentIncidentId: incidentId,
          cancelCountdownSec: state.settings.cancelWindowSec,
          incidents: [...state.incidents, incident],
        });
        state._startCancelCountdown();
      },
      cancelSOS: () => {
        const state = get();
        state._cleanup();
        const incidents = [...state.incidents];
        const idx = incidents.findIndex(i => i.id === state.currentIncidentId);
        if (idx >= 0) {
          incidents[idx] = {
            ...incidents[idx],
            endTime: Date.now(),
            states: [...incidents[idx].states, { state: 'safe', timestamp: Date.now() }],
          };
        }
        set({
          alertState: 'ready',
          currentIncidentId: null,
          countdownSec: 0,
          cancelCountdownSec: 0,
          incidents,
        });
      },
      confirmSafe: () => {
        const state = get();
        state._cleanup();
        state.contacts.forEach(c => {
          state._addMessage({
            contactId: c.id,
            contactName: c.name,
            channel: c.channel,
            message: state.settings.safeTemplate.replace('{name}', 'User'),
            direction: 'outbound',
            type: 'safe',
          });
        });
        const incidents = [...state.incidents];
        const idx = incidents.findIndex(i => i.id === state.currentIncidentId);
        if (idx >= 0) {
          incidents[idx] = {
            ...incidents[idx],
            endTime: Date.now(),
            resolvedBy: 'user',
            states: [...incidents[idx].states, { state: 'safe', timestamp: Date.now() }],
          };
        }
        set({
          alertState: 'safe',
          incidents,
        });
      },
      resetToReady: () => {
        const state = get();
        state._cleanup();
        const contacts = state.contacts.map(c => ({ ...c, responseStatus: 'none' as const, responseTime: undefined }));
        set({
          alertState: 'ready', currentIncidentId: null, countdownSec: 0, cancelCountdownSec: 0, contacts,
        });
      },
      simulateContactResponse: (contactId, keyword) => {
        const state = get();
        const kw = keyword.toLowerCase().trim();
        let status: Contact['responseStatus'] = 'acknowledged';
        if (kw === 'calling') status = 'calling';
        else if (kw === 'on my way' || kw === 'omw') status = 'on_my_way';
        const contacts = state.contacts.map(c =>
          c.id === contactId ? { ...c, responseStatus: status, responseTime: Date.now() } : c
        );
        const contact = state.contacts.find(c => c.id === contactId);
        if (contact) {
          state._addMessage({
            contactId,
            contactName: contact.name,
            channel: contact.channel,
            message: keyword,
            direction: 'inbound',
            type: 'response',
          });
        }
        const incidents = [...state.incidents];
        const idx = incidents.findIndex(i => i.id === state.currentIncidentId);
        if (idx >= 0) {
          incidents[idx] = { ...incidents[idx], contacts };
        }
        set({ contacts, incidents });
        if (status === 'calling' || status === 'on_my_way') {
          state._advanceState('responder_active');
        }
      },
      updateSettings: (s) => set(state => ({ settings: { ...state.settings, ...s } })),
      toggleDarkMode: () => set(state => {
        const newMode = !state.darkMode;
        if (newMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { darkMode: newMode };
      }),
      toggleDemoMode: () => set(state => ({ settings: { ...state.settings, demoMode: !state.settings.demoMode } })),
      clearIncidents: () => set({ incidents: [], messages: [] }),
      _advanceState: (next) => {
        const state = get();
        const incidents = [...state.incidents];
        const idx = incidents.findIndex(i => i.id === state.currentIncidentId);
        if (idx >= 0) {
          incidents[idx] = {
            ...incidents[idx], states: [...incidents[idx].states, { state: next, timestamp: Date.now() }],
          };
        }
        set({ alertState: next, incidents });
      },
      _addMessage: (msg) => set(state => ({ messages: [...state.messages, { ...msg, id: generateId(), timestamp: Date.now() }] })),
      _startCancelCountdown: () => {
        const state = get();
        const cancelWindow = state.settings.cancelWindowSec;
        let remaining = cancelWindow;
        const timer = window.setInterval(() => {
          remaining--;
          const current = get();
          if (remaining <= 0 || current.alertState !== 'triggered') {
            clearInterval(timer);
            if (current.alertState === 'triggered') {
              current._advanceState('alerted');
              current.contacts.forEach(c => {
                current._addMessage({
                  contactId: c.id, contactName: c.name, channel: c.channel,
                  message: current.settings.initialTemplate.replace('{name}', 'User'),
                  direction: 'outbound', type: 'initial',
                });
              });
              const t2 = window.setTimeout(() => {
                const s = get();
                if (s.alertState === 'alerted') {
                  s._advanceState('waiting');
                  s._startWaitingCountdown();
                }
              }, 1500);
              set(s => ({ _timers: [...s._timers, t2] }));
            }
            return;
          }
          set({ cancelCountdownSec: remaining });
        }, 1000);
        set(s => ({ _timers: [...s._timers, timer] }));
      },
      _startWaitingCountdown: () => {
        const state = get();
        const escalationDelay = state.settings.escalationDelaySec;
        let remaining = escalationDelay;
        set({ countdownSec: remaining });
        const timer = window.setInterval(() => {
          remaining--;
          const current = get();
          if (current.alertState === 'safe' || current.alertState === 'ready' || current.alertState === 'responder_active') {
            clearInterval(timer); return;
          }
          if (remaining <= 0) {
            clearInterval(timer); current._advanceState('escalating');
            current.contacts.forEach(c => {
              current._addMessage({
                contactId: c.id, contactName: c.name, channel: c.channel,
                message: current.settings.escalationTemplate.replace('{name}', 'User'),
                direction: 'outbound', type: 'escalation',
              });
            });
            return;
          }
          set({ countdownSec: remaining });
        }, 1000);
        set(s => ({ _timers: [...s._timers, timer] }));
      },
      _cleanup: () => {
        const state = get();
        state._timers.forEach(t => { clearInterval(t); clearTimeout(t); });
        set({ _timers: [] });
      },
    }),
    { name: 'shieldmode-storage', partialize: (state) => ({ contacts: state.contacts, incidents: state.incidents, messages: state.messages, settings: state.settings, darkMode: state.darkMode, onboardingComplete: state.onboardingComplete }) }
  )
);
