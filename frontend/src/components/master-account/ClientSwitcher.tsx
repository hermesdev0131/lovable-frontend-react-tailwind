import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, ChevronDown, Users, ShieldCheck, LogOut, UserCog } from 'lucide-react';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';


interface ClientSwitcherProps {
  triggerClassName?: string;
}

export const ClientSwitcher = ({ triggerClassName }: ClientSwitcherProps = {}) => {
  const { clients, currentClientId, switchToClient, isInMasterMode, toggleMasterMode } = useMasterAccount();
  // const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { authState, logoutAndRedirect } = useAuth();
  
  const currentClient = currentClientId !== null 
    ? clients.find(c => c.id === currentClientId) 
    : null;

  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.role === 'admin') {
      toggleMasterMode();
      switchToClient(null);
      // navigate('/master-account');
      // toast({
      //   title: "Switched to Master Account",
      //   description: "You now have access to all client accounts"
      // });
    }
  }, [authState, switchToClient, navigate, toggleMasterMode]);

  const handleSwitchToClient = (clientId: number) => {
    setOpen(false);
    
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access client accounts",
        variant: "destructive"
      });
      navigate('/login', { replace: true });
      return;
    }
    
    switchToClient(clientId);
    console.log(`Navigating to home after switching to client ID: ${clientId}`);
    navigate('/');
    toast({
      title: "Client Account Switched",
      description: `You are now viewing ${clients.find(c => c.id === clientId)?.firstName} ${clients.find(c => c.id === clientId)?.lastName}`
    });
  };

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
        if (currentClientId !== null) {
          switchToClient(null);
        }
        
        // If in master mode, toggle it to disable
        if (isInMasterMode) {
          toggleMasterMode();
        }
        
        // Use the auth service to properly logout and redirect to login page
        await logoutAndRedirect();
        
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
  
  const getClientInitials = (client: any) => {
    if (!client || !client.firstName || !client.lastName) {
      return "??";
    }
    return `${client.firstName.substring(0, 1)}${client.lastName.substring(0, 1)}`;
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
            <ShieldCheck className="h-3 w-3 mr-1" /> Admin
          </Badge>
        );
      case 'editor':
        return (
          <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <UserCog className="h-3 w-3 mr-1" /> Editor
          </Badge>
        );
      case 'viewer':
        return (
          <Badge variant="outline" className="ml-1 bg-gray-100 text-gray-800 hover:bg-gray-100">
            <Users className="h-3 w-3 mr-1" /> Viewer
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("flex items-center gap-2", triggerClassName)}>
          {!authState.isAuthenticated ? (
            <span>Select Account</span>
          ) : authState.user?.role === 'admin' ? (
            <>
              <Building2 className="h-4 w-4" />
              {/* <span className="font-medium">Master Account</span> */}
              <span className="font-medium max-w-[150px] truncate">{authState.user?.name}</span>
              <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <ShieldCheck className="h-3 w-3 mr-1" /> Admin
              </Badge>
            </>
          ) : authState.user?.role === 'editor' ? (
            <>
              {/* <Avatar className="h-6 w-6">
                <AvatarImage src={authState.user?.role} alt={`${authState.user?.name}`} />
                <AvatarFallback>{getClientInitials(authState.user)}</AvatarFallback>
              </Avatar> */}
              <UserCog className="h-4 w-4" />
              <span className="font-medium max-w-[150px] truncate">{authState.user?.name}</span>
              {getRoleBadge(authState.user?.role)}
            </>
          ) : authState.user?.role === 'viewer' ? (
            <>
              <Users className="h-4 w-4" />
              <span className="font-medium max-w-[150px] truncate">{authState.user?.name}</span>
              {getRoleBadge(authState.user?.role)}
            </>
          ) : (
            <span>Select Account</span>
          )}
        
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {!authState.isAuthenticated ? (
          <>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setOpen(false);
                navigate('/login', { replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Log In</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
            {authState.user?.role === 'admin' && (
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  switchToClient(null);
                  navigate('/master-account');
                }}
              >
                <Building2 className="h-4 w-4" />
                <span>Master Account</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator /> */}
            <DropdownMenuLabel>Client Accounts</DropdownMenuLabel>
            {clients.map(client => (
              <DropdownMenuItem
                key={client.id}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleSwitchToClient(client.id)}
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={client.logo} alt={`${client.firstName} ${client.lastName}`} />
                  <AvatarFallback>{getClientInitials(client)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{`${client.firstName} ${client.lastName}`}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function cn(...classes: any) {
  return classes.filter(Boolean).join(' ');
}
