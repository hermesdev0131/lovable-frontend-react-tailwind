
// Types and utilities for the CRM application

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  birthday: string | null;
  notes: string;
  lastContact: string;
  avatar: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type DealStage = string;

export const DEFAULT_STAGES: DealStage[] = ['lead', 'contact', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

export type Deal = {
  id: string;
  name: string;
  company: string;
  contactId: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Opportunity = {
  id: string;
  name: string;
  description: string;
  potentialValue: number;
  currency: string;
  probability: number;
  expectedCloseDate: string;
  contactId: string | null;
  status: 'new' | 'qualified' | 'unqualified' | 'won' | 'lost';
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  type: 'email' | 'calendar' | 'webhook' | 'api' | 'other';
  lastSync: string | null;
  apiKey: string;
  webhookUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// Empty arrays to replace sample data
export const contacts: Contact[] = [];
export const deals: Deal[] = [];
export const opportunities: Opportunity[] = [];
export const integrations: Integration[] = [];

// Default stage labels map
export const DEFAULT_STAGE_LABELS: Record<DealStage, string> = {
  'lead': 'Lead',
  'contact': 'Contact Made',
  'proposal': 'Proposal Sent',
  'negotiation': 'Negotiation',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost'
};

// Helper functions for working with data
export const getContactById = (id: string): Contact | undefined => {
  return contacts.find(contact => contact.id === id);
};

export const getStageLabel = (stage: DealStage, customLabels?: Record<DealStage, string>): string => {
  if (customLabels && customLabels[stage]) {
    return customLabels[stage];
  }
  return DEFAULT_STAGE_LABELS[stage] || stage;
};

export const formatCurrency = (value: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
