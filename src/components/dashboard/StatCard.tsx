
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  subtitle: string;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  onClick
}: StatCardProps) => {
  return (
    <Card 
      className="hover:shadow transition-all duration-300 ease-in-out cursor-pointer bg-white text-black dark:bg-card dark:text-card-foreground"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          <span className="text-muted-foreground font-medium">
            {subtitle}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
