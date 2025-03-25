
import React from 'react';
import { MoonStar, Sun, Menu, User, LogOut } from 'lucide-react';
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

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const { isInMasterMode, switchToClient } = useMasterAccount();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear any client selection
    switchToClient(null);
    
    // Navigate to root/login page
    navigate('/');
    
    // Show logout confirmation
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex flex-1 items-center justify-end">
        <nav className="flex items-center gap-2">
          <NotificationsPopover />
          <Separator orientation="vertical" className="h-6" />
          <ClientSwitcher />
          <Separator orientation="vertical" className="h-6" />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </Button>
          <Separator orientation="vertical" className="h-6" />
          
          {/* User dropdown menu - highly visible in top right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full p-1 h-10 w-10 flex items-center justify-center border-2 hover:bg-accent hover:text-accent-foreground">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/lovable-uploads/2e7bc354-d939-480c-b0dc-7aa03dbde994.png" alt="User" />
                  <AvatarFallback className="bg-primary/10">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 w-56 mt-1 bg-popover border border-border shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">My Account</p>
                  <p className="text-xs text-muted-foreground">
                    {isInMasterMode ? 'Master Account' : 'Client Account'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center" 
                onClick={() => navigate('/account')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center" 
                onClick={() => navigate('/settings')}
              >
                <svg
                  className="mr-2 h-4 w-4"
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
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 flex items-center font-medium"
              >
                <LogOut className="mr-2 h-4 w-4" />
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
