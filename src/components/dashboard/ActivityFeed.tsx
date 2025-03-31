
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  id: number;
  action: string;
  time: string;
  name: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onClearActivity?: (id: number) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, onClearActivity }) => {
  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader className="border-b border-muted/20 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="w-1 h-6 bg-[#D35400] mr-2 rounded-full"></div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((item, i) => (
              <div key={item.id} className="flex items-start justify-between space-x-3 animate-slide-in-right p-3 rounded-lg hover:bg-muted/20 transition-colors" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.name} • {item.time}
                    </div>
                  </div>
                </div>
                {onClearActivity && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-muted hover:opacity-100"
                    onClick={() => onClearActivity(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[120px] flex items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-2">No recent activity</p>
              <p className="text-sm text-muted-foreground">Your activity will appear here</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
