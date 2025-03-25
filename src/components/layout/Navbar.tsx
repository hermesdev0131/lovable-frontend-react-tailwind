
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New contact added", read: false },
    { id: 2, text: "Meeting scheduled for tomorrow", read: false },
    { id: 3, text: "Task deadline approaching", read: false }
  ]);
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 ? 
    pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1) : 
    'Dashboard';

  const handleLogout = () => {
    // In a real app, this would call your auth service's logout method
    // For now, we'll simulate logout by clearing localStorage and redirecting
    localStorage.clear();
    
    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      duration: 3000,
    });
    
    // Redirect to home page
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchQuery}"`,
        duration: 3000,
      });
      // In a real app, this would trigger a search action
      console.log(`Searching for: ${searchQuery}`);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
      duration: 2000,
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 z-10">
      <div className="text-xl font-semibold tracking-tight animate-fade-in">
        {currentPage}
      </div>
      
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="relative animate-fade-in">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] lg:w-[300px] pl-8 bg-background border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative animate-fade-in">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 animate-scale-in">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs h-7"
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className={`py-3 ${!notification.read ? 'bg-accent/50' : ''}`}>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm">{notification.text}</span>
                    <span className="text-xs text-muted-foreground">
                      {!notification.read && <span className="mr-2 text-primary font-medium">New</span>}
                      Today
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="animate-fade-in">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-scale-in">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>Account</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>Preferences</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              toast({
                title: "Notifications settings",
                description: "You can configure your notification preferences here",
              });
            }}>Notifications</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              toast({
                title: "Help Center",
                description: "The help documentation is opening in a new tab",
              });
              window.open('https://docs.example.com', '_blank');
            }}>Help</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full animate-fade-in overflow-hidden">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-scale-in">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
