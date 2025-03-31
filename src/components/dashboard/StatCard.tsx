
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  color,
  onClick,
  className
}: StatCardProps) => {
  return (
    <Card 
      className={`hover:shadow transition-all duration-300 ease-in-out cursor-pointer bg-white text-black dark:bg-card dark:text-card-foreground ${className || ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <div className={`p-2 rounded-full ${color || 'bg-primary/10'}`}>
            {icon}
          </div>
        </div>
        {description && (
          <div className="text-xs text-muted-foreground mt-2">
            <span className="text-muted-foreground font-medium">
              {description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
