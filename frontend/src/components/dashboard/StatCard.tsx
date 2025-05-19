
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  subtitle: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  onClick,
  isLoading = false
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
          <div className="text-3xl font-bold">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground text-lg">Loading...</span>
              </div>
            ) : (
              value
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <Icon className="h-5 w-5 text-primary" />
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          <span className="text-muted-foreground font-medium">
            {isLoading ? "Loading data..." : subtitle}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
