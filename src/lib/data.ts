// Mock data for the CRM application

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

// Mock contacts data
export const contacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    position: 'CEO',
    birthday: '1980-05-15',
    notes: 'Key decision maker, prefers email communication',
    lastContact: '2023-11-10',
    avatar: null,
    tags: ['vip', 'decision-maker'],
    createdAt: '2023-01-15T09:24:00Z',
    updatedAt: '2023-11-10T14:30:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.co',
    phone: '+1 (555) 987-6543',
    company: 'Company Co.',
    position: 'Marketing Director',
    birthday: '1985-08-23',
    notes: 'Interested in our premium plan',
    lastContact: '2023-12-01',
    avatar: null,
    tags: ['marketing', 'potential'],
    createdAt: '2023-03-20T13:45:00Z',
    updatedAt: '2023-12-01T10:15:00Z'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@techinnovate.com',
    phone: '+1 (555) 555-1212',
    company: 'Tech Innovate',
    position: 'CTO',
    birthday: null,
    notes: 'Technical background, focus on security features',
    lastContact: '2023-11-28',
    avatar: null,
    tags: ['technical', 'decision-maker'],
    createdAt: '2023-05-10T11:20:00Z',
    updatedAt: '2023-11-28T16:45:00Z'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Wilson',
    email: 'e.wilson@globalcorp.org',
    phone: '+1 (555) 789-0123',
    company: 'Global Corp',
    position: 'Procurement Manager',
    birthday: '1982-02-14',
    notes: 'Looking for long-term partnership',
    lastContact: '2023-12-05',
    avatar: null,
    tags: ['procurement', 'evaluating'],
    createdAt: '2023-09-05T09:30:00Z',
    updatedAt: '2023-12-05T11:00:00Z'
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'robert.chen@startupvision.co',
    phone: '+1 (555) 321-7890',
    company: 'StartupVision',
    position: 'Founder',
    birthday: '1990-11-30',
    notes: 'Startup with high growth potential',
    lastContact: '2023-11-22',
    avatar: null,
    tags: ['startup', 'high-potential'],
    createdAt: '2023-08-15T14:20:00Z',
    updatedAt: '2023-11-22T13:10:00Z'
  }
];

// Mock deals data
export const deals: Deal[] = [
  {
    id: '1',
    name: 'Enterprise Solution',
    company: 'Acme Inc.',
    contactId: '1',
    value: 75000,
    currency: 'USD',
    stage: 'proposal',
    probability: 60,
    expectedCloseDate: '2024-01-30',
    notes: 'Proposal sent, waiting for review',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-12-01T14:45:00Z'
  },
  {
    id: '2',
    name: 'Marketing Platform',
    company: 'Company Co.',
    contactId: '2',
    value: 45000,
    currency: 'USD',
    stage: 'negotiation',
    probability: 80,
    expectedCloseDate: '2024-01-15',
    notes: 'Negotiating final terms',
    createdAt: '2023-11-05T09:15:00Z',
    updatedAt: '2023-12-05T11:30:00Z'
  },
  {
    id: '3',
    name: 'Security Suite',
    company: 'Tech Innovate',
    contactId: '3',
    value: 120000,
    currency: 'USD',
    stage: 'lead',
    probability: 30,
    expectedCloseDate: '2024-03-10',
    notes: 'Initial interest expressed',
    createdAt: '2023-11-20T13:45:00Z',
    updatedAt: '2023-11-28T16:20:00Z'
  },
  {
    id: '4',
    name: 'Supply Chain Solution',
    company: 'Global Corp',
    contactId: '4',
    value: 250000,
    currency: 'USD',
    stage: 'contact',
    probability: 40,
    expectedCloseDate: '2024-04-15',
    notes: 'Discovery call scheduled',
    createdAt: '2023-11-30T15:00:00Z',
    updatedAt: '2023-12-05T10:15:00Z'
  },
  {
    id: '5',
    name: 'Startup Package',
    company: 'StartupVision',
    contactId: '5',
    value: 25000,
    currency: 'USD',
    stage: 'closed-won',
    probability: 100,
    expectedCloseDate: '2023-12-01',
    notes: 'Contract signed, implementation starting',
    createdAt: '2023-10-10T11:20:00Z',
    updatedAt: '2023-12-01T09:30:00Z'
  }
];

// Mock opportunities data
export const opportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Global Expansion Partnership',
    description: 'Potential partnership for market expansion in APAC region',
    potentialValue: 500000,
    currency: 'USD',
    probability: 25,
    expectedCloseDate: '2024-06-30',
    contactId: '1',
    status: 'new',
    source: 'Industry Conference',
    notes: 'Initial discussions at Tech Summit 2023',
    createdAt: '2023-11-15T09:30:00Z',
    updatedAt: '2023-11-15T09:30:00Z'
  },
  {
    id: '2',
    name: 'White Label Solution',
    description: 'Providing our platform as white label solution',
    potentialValue: 350000,
    currency: 'USD',
    probability: 40,
    expectedCloseDate: '2024-03-15',
    contactId: '2',
    status: 'qualified',
    source: 'Referral',
    notes: 'Interested in full feature set with custom branding',
    createdAt: '2023-10-20T14:15:00Z',
    updatedAt: '2023-11-28T11:45:00Z'
  },
  {
    id: '3',
    name: 'Government Contract',
    description: 'Potential government agency contract',
    potentialValue: 1200000,
    currency: 'USD',
    probability: 15,
    expectedCloseDate: '2024-09-30',
    contactId: '3',
    status: 'new',
    source: 'Direct Outreach',
    notes: 'Long sales cycle expected, multiple stakeholders',
    createdAt: '2023-11-30T10:45:00Z',
    updatedAt: '2023-11-30T10:45:00Z'
  },
  {
    id: '4',
    name: 'API Integration Partnership',
    description: 'Technology partnership with complementary product',
    potentialValue: 150000,
    currency: 'USD',
    probability: 60,
    expectedCloseDate: '2024-02-28',
    contactId: '4',
    status: 'qualified',
    source: 'Partner Referral',
    notes: 'Technical discussions underway',
    createdAt: '2023-11-10T13:20:00Z',
    updatedAt: '2023-12-01T15:30:00Z'
  },
  {
    id: '5',
    name: 'Education Sector Solution',
    description: 'Customized solution for higher education',
    potentialValue: 80000,
    currency: 'USD',
    probability: 35,
    expectedCloseDate: '2024-05-15',
    contactId: null,
    status: 'new',
    source: 'Marketing Campaign',
    notes: 'Need to identify key contacts',
    createdAt: '2023-11-25T11:10:00Z',
    updatedAt: '2023-11-25T11:10:00Z'
  }
];

// Mock integrations data
export const integrations: Integration[] = [
  {
    id: '1',
    name: 'Gmail Integration',
    description: 'Email sync and tracking with Gmail',
    status: 'active',
    type: 'email',
    lastSync: '2023-12-06T08:45:00Z',
    apiKey: 'gmail_api_key_1234',
    webhookUrl: null,
    createdAt: '2023-09-15T10:20:00Z',
    updatedAt: '2023-12-06T08:45:00Z'
  },
  {
    id: '2',
    name: 'Google Calendar',
    description: 'Calendar sync and meeting scheduling',
    status: 'active',
    type: 'calendar',
    lastSync: '2023-12-06T09:30:00Z',
    apiKey: 'gcal_api_key_5678',
    webhookUrl: null,
    createdAt: '2023-09-15T10:25:00Z',
    updatedAt: '2023-12-06T09:30:00Z'
  },
  {
    id: '3',
    name: 'Slack Notifications',
    description: 'Deal and opportunity alerts',
    status: 'inactive',
    type: 'webhook',
    lastSync: '2023-11-30T14:15:00Z',
    apiKey: 'slack_api_key_9012',
    webhookUrl: 'https://hooks.slack.com/services/...',
    createdAt: '2023-10-10T16:45:00Z',
    updatedAt: '2023-11-30T14:15:00Z'
  },
  {
    id: '4',
    name: 'HubSpot Data Sync',
    description: 'Bidirectional data sync with HubSpot',
    status: 'error',
    type: 'api',
    lastSync: '2023-12-05T11:20:00Z',
    apiKey: 'hubspot_api_key_3456',
    webhookUrl: null,
    createdAt: '2023-11-01T09:15:00Z',
    updatedAt: '2023-12-05T11:20:00Z'
  },
  {
    id: '5',
    name: 'Zapier Integration',
    description: 'Custom workflow automation',
    status: 'active',
    type: 'webhook',
    lastSync: '2023-12-06T10:45:00Z',
    apiKey: '',
    webhookUrl: 'https://hooks.zapier.com/hooks/catch/...',
    createdAt: '2023-11-15T13:30:00Z',
    updatedAt: '2023-12-06T10:45:00Z'
  }
];

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
