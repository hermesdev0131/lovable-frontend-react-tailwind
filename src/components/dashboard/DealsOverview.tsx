
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
  
  // Custom rendering for labels to control their size and prevent overflow
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Only display label if the segment is large enough (more than 10%)
    if (percent < 0.1) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#000000" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${name}`}
      </text>
    );
  };
  
  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader className="border-b border-muted/20">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="w-1 h-6 bg-[#D35400] mr-2 rounded-full"></div>
          Deal Overview
        </CardTitle>
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
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {dealStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    // For "Open" deals, use the burnt orange
                    entry.name === "Open" ? "#D35400" : 
                    // For "Won" deals, keep the green
                    entry.name === "Won" ? "#10b981" : 
                    // For "Lost" deals, keep the red
                    entry.name === "Lost" ? "#ef4444" :
                    // Otherwise default to burnt orange
                    "#D35400"
                  } />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} deals`, '']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ 
                  paddingTop: '15px',
                  fontSize: '12px'
                }}
                formatter={(value, entry, index) => {
                  // Format the legend text to include the count
                  const item = dealStageData[index];
                  return <span style={{ color: '#333' }}>{value} ({item.value})</span>;
                }}
              />
            </RechartsChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground">
            <PieChart className="h-16 w-16 mx-auto mb-4 text-[#D35400]/40" />
            <p>Add deals to see your deal overview</p>
            <Button 
              className="mt-4 bg-[#D35400] hover:bg-[#B74600]"
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
