import React from 'react';
import { Users, LineChart, PieChart } from 'lucide-react';
import StatCard from './StatCard';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStatsProps {
  totalContacts: number;
  openDeals: number;
  totalDealValue: number;
  onCardClick: (title: string, path: string) => void;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalContacts,
  openDeals,
  totalDealValue,
  onCardClick,
  isLoading = false
}) => {
  const { authState } = useAuth();
  const isAuthenticated = authState?.isAuthenticated ?? false;

  const handleCardClick = (title: string, path: string) => {
    if (!isAuthenticated) return;
    onCardClick(title, path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Contacts"
        value={totalContacts}
        icon={Users}
        subtitle={totalContacts === 0 ? "No contacts added yet" : `${totalContacts} total contacts`}
        onClick={() => handleCardClick("Contacts", "/clients")}
        isLoading={isLoading}
        disabled={!isAuthenticated}
      />
      
      <StatCard
        title="Active Deals"
        value={openDeals}
        icon={LineChart}
        subtitle={openDeals === 0 ? "No active deals" : `${openDeals} active deals in progress`}
        onClick={() => handleCardClick("Deals", "/deals")}
        isLoading={isLoading}
        disabled={!isAuthenticated}
      />
      
      <StatCard
        title="Pipeline Value"
        value={formatCurrency(totalDealValue)}
        icon={PieChart}
        subtitle={totalDealValue === 0 ? "No value in pipeline yet" : `${formatCurrency(totalDealValue)} total pipeline value`}
        onClick={() => handleCardClick("Opportunities", "/reports")}
        isLoading={isLoading}
        disabled={!isAuthenticated}
      />
    </div>
  );
};

export default DashboardStats;
