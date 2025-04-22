import { Deal } from '@/components/deals/types';
import { DealFormField } from '@/components/deals/DealForm';

export const initialClients = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    company: "Acme Inc",
    phone: "+1234567890",
    status: "active"
  }
];

export const initialDeals: Deal[] = [
  {
    id: "1",
    name: "Enterprise Software Deal",
    company: "TechCorp",
    value: 50000,
    currency: "USD",
    probability: 75,
    stage: "negotiation",
    closingDate: "2024-06-30",
    description: "Enterprise software implementation project",
    assignedTo: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Marketing Campaign",
    company: "BrandCo",
    value: 25000,
    currency: "USD",
    probability: 50,
    stage: "proposal",
    closingDate: "2024-07-15",
    description: "Q3 Marketing campaign planning",
    assignedTo: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialDealFields: DealFormField[] = [
  {
    id: "budget",
    label: "Budget",
    type: "number",
    required: false
  },
  {
    id: "timeline",
    label: "Timeline",
    type: "text",
    required: false
  }
]; 