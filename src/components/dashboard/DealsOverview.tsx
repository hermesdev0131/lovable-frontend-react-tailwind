
import React from 'react';
import { PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface DealStageData {
  name: string;
  value: number;
  color: string;
}

interface DealsOverviewProps {
  dealStageData: DealStageData[];
  hasDeals: boolean;
}

const DealsOverview: React.FC<DealsOverviewProps> = ({ dealStageData, hasDeals }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader>
        <CardTitle>Deal Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {hasDeals ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsChart>
              <Pie
                data={dealStageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {dealStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} deals`, '']} />
              <Legend />
            </RechartsChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground">
            <PieChart className="h-16 w-16 mx-auto mb-4 text-primary/40" />
            <p>Add deals to see your deal overview</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/deals')}
            >
              View Deals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealsOverview;
