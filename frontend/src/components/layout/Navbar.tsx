import React from 'react';
import { Menu, User, LogOut, LogIn, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClientSwitcher } from '@/components/master-account/ClientSwitcher';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { useAuth } from '@/contexts/AuthContext';
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
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { isInMasterMode, switchToClient, toggleMasterMode, currentClientId } = useMasterAccount();
  const { authState, logoutAndRedirect } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  
  // Determine if user is authenticated based on either auth system
  const isUserAuthenticated = authState.isAuthenticated || isInMasterMode || currentClientId !== null;
  const isAdmin = authState.user?.role === 'admin';
  
  // Reset dropdown state when auth state changes
  // React.useEffect(() => {
  //   if (!isUserAuthenticated) {
  //     setDropdownOpen(false);
  //   }
  // }, [authState.isAuthenticated, isInMasterMode, currentClientId, isUserAuthenticated]);
  
  const handleLogout = async () => {
    // Prevent multiple logout attempts
    if (isLoggingOut) {
      console.log("Logout already in progress, ignoring additional click");
      return;
    }
    
    try {
      // Set logging out state to prevent multiple clicks
      setIsLoggingOut(true);
      
      console.log("Starting logout and redirect process");
      
      // Clear client selection first
      
      
      // If in master mode, toggle it to disable
      // if (isInMasterMode) {
      //   toggleMasterMode();
      // }
      
      // Use the auth service to properly logout and redirect to login page
      await logoutAndRedirect();
      
      if (currentClientId !== null) {
        switchToClient(null);
      }
      if (isInMasterMode) {
        toggleMasterMode();
      }
      // No need to navigate here as logoutAndRedirect already does that
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Reset the logging out state after a delay
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 500);
    }
  };
  
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b bg-background/95 px-3 md:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Desktop Search bar */}
      {!isMobile && (
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
      )}
      
      <div className="flex flex-1 items-center justify-end gap-2">
        <nav className="flex items-center gap-2 md:gap-4">
          {/* Mobile search button */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-10">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-background pl-8"
                    autoFocus
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Notifications */}
          {isMobile ? (
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
          ) : (
            <NotificationsPopover />
          )}
          
          {!isMobile && <Separator orientation="vertical" className="h-6" />}
          
          {/* Client Switcher (desktop only) */}
          {!isMobile && (
            <> 
              <ClientSwitcher />
              <Separator orientation="vertical" className="h-6" />
            </>
          )}
          
          {/* Theme toggle (desktop only) */}
          {!isMobile && (
            <>
              <ThemeToggle />
              <Separator orientation="vertical" className="h-6" />
            </>
          )}
          
          {/* User dropdown menu */}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "rounded-full flex items-center justify-center border-2 border-primary hover:bg-accent hover:text-accent-foreground relative shadow-md",
                  isMobile ? "h-9 w-9" : "h-12 w-12 ml-1"
                )}
              >
                {isUserAuthenticated && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                )}
                <Avatar className={cn("border border-primary/20", isMobile ? "h-7 w-7" : "h-10 w-10")}>
                  {isUserAuthenticated ? (
                    <>
                      <AvatarImage src="/lovable-uploads/2e7bc354-d939-480c-b0dc-7aa03dbde994.png" alt={authState.user?.name || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-lg font-bold">
                        {authState.user?.name 
                          ? authState.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                          : isInMasterMode 
                            ? 'MA'
                            : currentClientId !== null
                              ? 'CL'
                              : 'U'}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-primary/10 text-lg font-bold">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="z-50 w-64 mt-1 bg-popover border-2 border-primary/20 shadow-lg rounded-lg"
            >
              <DropdownMenuLabel className="font-normal py-3">
                <div className="flex flex-col space-y-1">
                  {isUserAuthenticated ? (
                    <>
                      <p className="text-base font-medium">
                        {authState.user?.name || 'My Account'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {authState.user?.email || (isInMasterMode ? 'Master Admin' : 'Client User')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isInMasterMode ? 'Master Account' : currentClientId !== null ? 'Client Account' : 'User Account'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base font-medium">Account</p>
                      <p className="text-sm text-muted-foreground">
                        Not logged in
                      </p>
                    </>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/20" />
              
              {/* Mobile-only items */}
              {isMobile && (
                <>
                  <DropdownMenuItem className="py-2.5 text-base">
                    <ClientSwitcher triggerClassName="w-full justify-start" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5 text-base">
                    <ThemeToggle variant="dropdown" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/20" />
                </>
              )}
              
              {/* Auth state is now properly handled */}
              
              {isUserAuthenticated ? (
                <>
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
                    disabled={isLoggingOut}
                    className={cn(
                      "cursor-pointer bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 flex items-center font-medium py-2.5 text-base",
                      isLoggingOut && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isLoggingOut ? (
                      <>
                        <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-5 w-5" />
                        Log out
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center py-2.5 text-base bg-blue-50 dark:bg-blue-950/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950/30 font-medium" 
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Log in
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

// Helper function to conditionally add classes
function cn(...classes: any) {
  return classes.filter(Boolean).join(' '); 
}
