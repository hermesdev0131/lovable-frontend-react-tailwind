import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface DealsOverviewProps {
  dealStageData: ChartData[];
  hasDeals: boolean;
}

const DealsOverview: React.FC<DealsOverviewProps> = ({ dealStageData, hasDeals }) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const isAuthenticated = authState?.isAuthenticated ?? false;

  const handleCreateDeal = () => {
    if (!isAuthenticated) return;
    navigate('/deals');
  };

  return (
    <Card className={`transition-all duration-300 ease-in-out ${
      !isAuthenticated ? 'opacity-80' : 'hover:shadow'
    } bg-white text-black dark:bg-card dark:text-card-foreground`}>
      <CardHeader>
        <CardTitle>Deals Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {hasDeals ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dealStageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dealStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value, entry, index) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
              <Tooltip 
                formatter={(value, name, props) => [value, name]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">No deals data available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateDeal}
              className="flex items-center gap-1"
              disabled={!isAuthenticated}
            >
              <Plus className="h-4 w-4" /> Create Deal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealsOverview;
