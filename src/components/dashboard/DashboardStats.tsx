
import React from 'react';
import { Users, DollarSign, Briefcase, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import StatCard from './StatCard';

interface DashboardStatsProps {
  totalContacts: number;
  openDeals: number;
  totalDealValue: number;
  totalProjects?: number;
  onCardClick?: (title: string, path: string) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalContacts,
  openDeals,
  totalDealValue,
  totalProjects = 0,
  onCardClick
}) => {
  const handleCardClick = (title: string, path: string) => {
    if (onCardClick) {
      onCardClick(title, path);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Contacts"
        value={totalContacts.toString()}
        icon={<Users className="h-6 w-6 text-blue-500" />}
        description="Active contacts in your CRM"
        onClick={() => handleCardClick("Contacts", "/contacts")}
        color="bg-blue-50 dark:bg-blue-900"
        className="cursor-pointer hover:shadow-md transition-all"
      />
      
      <StatCard
        title="Open Deals"
        value={openDeals.toString()}
        icon={<Briefcase className="h-6 w-6 text-amber-500" />}
        description="Deals currently in progress"
        onClick={() => handleCardClick("Deals", "/deals")}
        color="bg-amber-50 dark:bg-amber-900"
        className="cursor-pointer hover:shadow-md transition-all"
      />
      
      <StatCard
        title="Total Deal Value"
        value={formatCurrency(totalDealValue)}
        icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
        description="Sum of all deal values"
        onClick={() => handleCardClick("Reports", "/reports")}
        color="bg-emerald-50 dark:bg-emerald-900"
        className="cursor-pointer hover:shadow-md transition-all"
      />
      
      <StatCard
        title="Projects"
        value={totalProjects.toString()}
        icon={<BarChart2 className="h-6 w-6 text-purple-500" />}
        description="Active and completed projects"
        onClick={() => handleCardClick("Projects", "/projects")}
        color="bg-purple-50 dark:bg-purple-900"
        className="cursor-pointer hover:shadow-md transition-all"
      />
    </div>
  );
};

export default DashboardStats;
