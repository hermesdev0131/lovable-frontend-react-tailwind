
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
}

export interface Stage {
  id: string;
  label: string;
}
