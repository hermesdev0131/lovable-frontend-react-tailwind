import React from 'react';
import { MoonStar, Sun, Menu, User, LogOut, Search } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClientSwitcher } from '@/components/master-account/ClientSwitcher';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const { isInMasterMode, switchToClient, toggleMasterMode } = useMasterAccount();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear client selection
    switchToClient(null);
    
    // Ensure master mode is disabled to trigger login screen
    toggleMasterMode(false);
    
    // Navigate to root/login page
    navigate('/');
    
    // Show logout confirmation
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };
  
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Search bar */}
      <div className="relative max-w-md flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px] border-gray-800 focus-visible:ring-gray-700"
          />
        </div>
      </div>
      
      <div className="flex flex-1 items-center justify-end">
        <nav className="flex items-center gap-4">
          <NotificationsPopover />
          <Separator orientation="vertical" className="h-6" />
          <ClientSwitcher />
          <Separator orientation="vertical" className="h-6" />
          
          {/* Theme toggle */}
          <ThemeToggle />
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* User dropdown menu with very prominent styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-full h-12 w-12 flex items-center justify-center border-2 border-primary hover:bg-accent hover:text-accent-foreground ml-1 relative shadow-md"
              >
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src="/lovable-uploads/2e7bc354-d939-480c-b0dc-7aa03dbde994.png" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-lg font-bold">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="z-50 w-64 mt-1 bg-popover border-2 border-primary/20 shadow-lg rounded-lg"
            >
              <DropdownMenuLabel className="font-normal py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium">My Account</p>
                  <p className="text-sm text-muted-foreground">
                    {isInMasterMode ? 'Master Account' : 'Client Account'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/20" />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center py-2.5 text-base" 
                onClick={() => navigate('/account')}
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center py-2.5 text-base" 
                onClick={() => navigate('/settings')}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/20" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 flex items-center font-medium py-2.5 text-base"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
