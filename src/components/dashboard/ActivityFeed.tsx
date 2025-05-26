import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2, Calendar, Mail, MessageCircle, Phone, Send, Globe, Star, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/contexts/TasksContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth';
import { getRelativeTimeString } from '@/utils/dateUtils';

interface ActivityItem {
  id: number;
  action: string;
  time: string;
  name: string;
}

const ActivityFeed: React.FC = () => {
  const { clearCompletedTasks } = useTasks();
  const { authState } = useAuth();
  const isAuthenticated = authState?.isAuthenticated ?? false;
  const { toast } = useToast();
  const activities = authService.getActivities().slice(0, 10);

  // Function to get icon based on activity type
  const getActivityIcon = (action: string) => {
    if (action.includes("Email") || action.includes("email")) return <Mail className="h-4 w-4" />;
    if (action.includes("Call") || action.includes("call")) return <Phone className="h-4 w-4" />;
    if (action.includes("Task") || action.includes("task")) return <Calendar className="h-4 w-4" />;
    if (action.includes("Text") || action.includes("text")) return <Send className="h-4 w-4" />;
    if (action.includes("Chat") || action.includes("chat")) return <MessageCircle className="h-4 w-4" />;
    if (action.includes("review") || action.includes("Review")) return <Star className="h-4 w-4" />;
    if (action.includes("Deal") || action.includes("Deal")) return <Globe className="h-4 w-4" />;
    return <PenLine className="h-4 w-4" />;
  };

  const handleClearAll = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to clear activities",
        variant: "destructive"
      });
      return;
    }

    // Clear all completed tasks from TasksContext
    clearCompletedTasks();
    
    // Clear all activities from auth service
    authService.clearAllActivities();
  };

  const handleClearActivity = (id: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to clear activities",
        variant: "destructive"
      });
      return;
    }

    // Clear activity from auth service
    authService.clearActivity(id);
  };

  return (
    <Card className={`transition-all duration-300 ease-in-out ${
      !isAuthenticated ? 'opacity-80' : 'hover:shadow'
    } bg-white text-black dark:bg-card dark:text-card-foreground`}>
      <CardHeader className="border-b border-muted/20 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="w-1 h-6 bg-[#D35400] mr-2 rounded-full"></div>
          Recent Activity
        </CardTitle>
        {activities.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearAll}
            className="text-sm"
            disabled={!isAuthenticated}
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {!isAuthenticated ? (
          <div className="h-[120px] flex items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-2">Please log in to view activities</p>
            </div>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((item, i) => (
              <div 
                key={item.id} 
                className="flex items-start justify-between space-x-3 group animate-slide-in-right p-3 rounded-lg hover:bg-muted/20 transition-colors" 
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(item.action)}
                  </div>
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.name} • {getRelativeTimeString(item.time)}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-muted hover:opacity-100"
                  onClick={() => handleClearActivity(item.id)}
                  disabled={!isAuthenticated}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
