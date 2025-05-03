
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Deal, Stage } from './types';
import { TeamMember } from '@/components/settings/TeamMembers';

interface DealFormFieldsProps {
  deal: Deal;
  stages: Stage[];
  teamMembers: TeamMember[];
  onChange: (field: string, value: any) => void;
}

const DealFormFields: React.FC<DealFormFieldsProps> = ({ deal, stages, teamMembers, onChange }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Deal Name</Label>
          <Input
            id="name"
            value={deal.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={deal.company}
            onChange={(e) => onChange('company', e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="value">Deal Value</Label>
          <Input
            id="value"
            type="number"
            value={deal.value}
            onChange={(e) => onChange('value', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select 
            value={deal.currency} 
            onValueChange={(value) => onChange('currency', value)}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            value={deal.probability}
            onChange={(e) => onChange('probability', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="stage">Stage</Label>
          <Select 
            value={deal.stage} 
            onValueChange={(value) => onChange('stage', value)}
          >
            <SelectTrigger id="stage">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>{stage.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select 
            value={deal.assignedTo || ""} 
            onValueChange={(value) => onChange('assignedTo', value)}
          >
            <SelectTrigger id="assignedTo">
              <SelectValue placeholder="Select person" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="account-owner">Account Owner</SelectItem>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="date">Expected Close Date</Label>
          <Input
            id="date"
            type="date"
            value={deal.closingDate}
            onChange={(e) => onChange('closingDate', e.target.value)}
            className="w-full"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={deal.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DealFormFields;
