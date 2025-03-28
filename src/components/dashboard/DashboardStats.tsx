
import React from 'react';
import { Users, LineChart, PieChart } from 'lucide-react';
import StatCard from './StatCard';
import { formatCurrency } from '@/utils/formatters';

interface DashboardStatsProps {
  totalContacts: number;
  openDeals: number;
  totalDealValue: number;
  onCardClick: (title: string, path: string) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalContacts,
  openDeals,
  totalDealValue,
  onCardClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Contacts"
        value={totalContacts}
        icon={Users}
        subtitle={totalContacts === 0 ? "No contacts added yet" : `${totalContacts} total contacts`}
        onClick={() => onCardClick("Contacts", "/contacts")}
      />
      
      <StatCard
        title="Active Deals"
        value={openDeals}
        icon={LineChart}
        subtitle={openDeals === 0 ? "No active deals" : `${openDeals} active deals in progress`}
        onClick={() => onCardClick("Deals", "/deals")}
      />
      
      <StatCard
        title="Pipeline Value"
        value={formatCurrency(totalDealValue)}
        icon={PieChart}
        subtitle={totalDealValue === 0 ? "No value in pipeline yet" : `${formatCurrency(totalDealValue)} total pipeline value`}
        onClick={() => onCardClick("Opportunities", "/opportunities")}
      />
    </div>
  );
};

export default DashboardStats;
