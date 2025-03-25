
import React from 'react';
import { MoonStar, Sun, Menu } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClientSwitcher } from '@/components/master-account/ClientSwitcher';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const { isInMasterMode } = useMasterAccount();
  
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
