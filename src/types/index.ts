export type AlertState =
  | 'ready'
  | 'triggered'
  | 'alerted'
  | 'waiting'
  | 'escalating'
  | 'responder_active'
  | 'safe';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  channel: 'whatsapp' | 'telegram' | 'sms';
  responseStatus?: 'none' | 'acknowledged' | 'calling' | 'on_my_way';
  responseTime?: number;
}

export interface IncidentLog {
  id: string;
  startTime: number;
  endTime?: number;
  states: { state: AlertState; timestamp: number }[];
  contacts: Contact[];
  resolvedBy?: string;
  demoMode: boolean;
}

export interface MessageLog {
  id: string;
  contactId: string;
  contactName: string;
  channel: string;
  message: string;
  timestamp: number;
  direction: 'outbound' | 'inbound';
  type: 'initial' | 'escalation' | 'response' | 'safe';
}

export interface Settings {
  escalationDelaySec: number;
  cancelWindowSec: number;
  initialTemplate: string;
  escalationTemplate: string;
  safeTemplate: string;
  demoMode: boolean;
}
