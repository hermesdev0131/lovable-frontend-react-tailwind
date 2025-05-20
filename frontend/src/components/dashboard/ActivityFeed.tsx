import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2, Calendar, Mail, MessageCircle, Phone, Send, Globe, Star, PenLine, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/contexts/TasksContext';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ActivityFeed: React.FC = () => {
  const { tasks, isLoading, clearCompletedTasks } = useTasks();

  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'CALL':
        return <Phone className="h-4 w-4" />;
      case 'TODO':
        return <Calendar className="h-4 w-4" />;
      default:
        return <PenLine className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'CALL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'TODO':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleClearAll = () => {
    clearCompletedTasks();
  };

  // Sort tasks by creation date, most recent first
  const sortedActivities = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader className="border-b border-muted/20 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="w-1 h-6 bg-[#D35400] mr-2 rounded-full"></div>
          Recent Activity
        </CardTitle>
        {sortedActivities.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearAll}
            className="text-sm"
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading activities...</p>
            </div>
          </div>
        ) : sortedActivities.length > 0 ? (
          <div className="space-y-4">
            {sortedActivities.map((activity, i) => (
              <div 
                key={activity.id} 
                className="flex items-start justify-between space-x-3 group animate-slide-in-right p-3 rounded-lg hover:bg-muted/20 transition-colors" 
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">
                        {activity.title}
                      </p>
                      <div className="flex gap-1 flex-wrap ml-auto">
                        <Badge className={cn(getActivityColor(activity.type), "flex-shrink-0")}>
                          <span className="flex items-center gap-1">
                            {getActivityIcon(activity.type)}
                            <span className="hidden sm:inline capitalize text-xs">{activity.type}</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                      {activity.source && (
                        <span className="ml-2 text-xs opacity-70">via {activity.source}</span>
                      )}
                    </div>
                  </div>
                </div>
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
