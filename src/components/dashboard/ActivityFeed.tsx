
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ActivityItem {
  id: number;
  action: string;
  time: string;
  name: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((item, i) => (
              <div key={item.id} className="flex items-start space-x-3 animate-slide-in-right" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <div className="font-medium">{item.action}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.name} • {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-center">
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
