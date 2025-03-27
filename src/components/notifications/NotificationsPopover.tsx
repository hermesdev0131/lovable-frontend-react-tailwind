
import React, { useState } from 'react';
import { Bell, BellDot, Check, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from "@/hooks/use-toast";

export const NotificationsPopover = () => {
  const { 
    getNotifications, 
    getUnreadNotificationsCount, 
    markNotificationAsRead, 
    currentClientId, 
    isInMasterMode 
  } = useMasterAccount();
  
  const [open, setOpen] = useState(false);
  
  const clientId = isInMasterMode ? null : currentClientId;
  const notifications = getNotifications(clientId);
  const unreadCount = getUnreadNotificationsCount(clientId);
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  
  const handleDismissNotification = (id: number) => {
    markNotificationAsRead(id);
    toast({
      title: "Notification dismissed",
      description: "The notification has been marked as read",
    });
  };
  
  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
    toast({
      title: "All notifications read",
      description: "All notifications have been marked as read",
    });
  };
  
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <div className="h-2 w-2 rounded-full bg-green-500" />;
      case 'rejection':
        return <div className="h-2 w-2 rounded-full bg-red-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    }
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 flex items-center justify-between">
          <span className="font-medium">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
              <Check className="h-3 w-3 mr-1" /> Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 hover:bg-muted/50 ${!notification.read ? 'bg-muted/20' : ''}`}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-2 h-6 w-6 opacity-60 hover:opacity-100"
                    onClick={() => handleDismissNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="flex items-start gap-3 pr-6">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNotificationTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
