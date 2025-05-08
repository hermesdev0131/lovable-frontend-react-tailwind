
import React, { useState } from 'react';
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
import { Building2, ChevronDown, Users, ShieldCheck, LogOut } from 'lucide-react';
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
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const currentClient = currentClientId !== null 
    ? clients.find(c => c.id === currentClientId) 
    : null;
    
  const handleSwitchToMaster = () => {
    setOpen(false);
    
    // Check if user is authenticated
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the Master Account",
        variant: "destructive"
      });
      navigate('/login', { replace: true });
      return;
    }
    
    switchToClient(null);
    navigate('/master-account');
    toast({
      title: "Switched to Master Account",
      description: "You now have access to all client accounts"
    });
  };
  
  const handleSwitchToClient = (clientId: number) => {
    setOpen(false);
    
    // Check if user is authenticated
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
    navigate('/');
    toast({
      title: "Client Account Switched",
      description: `You are now viewing ${clients.find(c => c.id === clientId)?.firstName} ${clients.find(c => c.id === clientId)?.lastName}`
    });
  };

  const handleLogout = () => {
    switchToClient(null);
    
    if (isInMasterMode) {
      toggleMasterMode();
    }
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
    
    navigate('/login', { replace: true });
  };
  
  // Helper function to safely get client initials
  const getClientInitials = (client: any) => {
    if (!client || !client.firstName || !client.lastName) {
      return "??";
    }
    return `${client.firstName.substring(0, 1)}${client.lastName.substring(0, 1)}`;
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("flex items-center gap-2", triggerClassName)}>
          {!authState.isAuthenticated ? (
            // Show "Select Account" for unauthenticated users
            <span>Select Account</span>
          ) : isInMasterMode && authState.user?.role === 'admin' ? (
            // Show Master Account for authenticated admin users in master mode
            <>
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Master Account</span>
              <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <ShieldCheck className="h-3 w-3 mr-1" /> Admin
              </Badge>
            </>
          ) : currentClient ? (
            // Show client account for authenticated users with a selected client
            <>
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentClient.logo} alt={`${currentClient.firstName} ${currentClient.lastName}`} />
                <AvatarFallback>{getClientInitials(currentClient)}</AvatarFallback>
              </Avatar>
              <span className="font-medium max-w-[150px] truncate">{`${currentClient.firstName} ${currentClient.lastName}`}</span>
              <Badge variant="outline" className="ml-1 bg-green-100 text-green-800 hover:bg-green-100">
                Client
              </Badge>
            </>
          ) : (
            // Default case for authenticated users without a selected client
            <span>Select Account</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {!authState.isAuthenticated ? (
          // Show limited menu for unauthenticated users
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
          // Show full menu for authenticated users
          <>
            <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
            {authState.user?.role === 'admin' && (
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleSwitchToMaster}
              >
                <Building2 className="h-4 w-4" />
                <span>Master Account</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
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
            {authState.user?.role === 'admin' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    navigate('/master-account');
                  }}
                >
                  <Users className="h-4 w-4" />
                  <span>Manage Clients</span>
                </DropdownMenuItem>
              </>
            )}
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
