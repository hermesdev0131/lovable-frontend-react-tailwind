
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/lovable-uploads/2e7bc354-d939-480c-b0dc-7aa03dbde994.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/account')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
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
