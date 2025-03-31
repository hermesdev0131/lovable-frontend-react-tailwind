export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  currency: string;
  probability: number;
  stage: string;
  closingDate: string;
  description: string;
  assignedTo?: string;
  contactId?: string;
  expectedCloseDate?: string;
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
  attachments?: Array<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>;
  appointments?: Array<{
    title: string;
    datetime: string;
  }>;
}

export interface Stage {
  id: string;
  label: string;
}

export interface Column {
  id: string;
  label: string;
}

export type DealStage = string;

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'discovery', label: 'Discovery' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' }
];

export const STORAGE_KEYS = {
  DEALS_COLUMNS: 'crm_deals_columns',
  OPPORTUNITIES_COLUMNS: 'crm_opportunities_columns',
  DEALS_DATA: 'crm_deals_data'
};
