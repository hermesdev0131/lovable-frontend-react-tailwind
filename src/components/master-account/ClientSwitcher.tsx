
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

interface ClientSwitcherProps {
  triggerClassName?: string;
}

export const ClientSwitcher = ({ triggerClassName }: ClientSwitcherProps = {}) => {
  const { clients, currentClientId, switchToClient, isInMasterMode } = useMasterAccount();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const currentClient = currentClientId !== null 
    ? clients.find(c => c.id === currentClientId) 
    : null;
    
  const handleSwitchToMaster = () => {
    switchToClient(null);
    setOpen(false);
    navigate('/master-account');
    toast({
      title: "Switched to Master Account",
      description: "You now have access to all client accounts"
    });
  };
  
  const handleSwitchToClient = (clientId: number) => {
    switchToClient(clientId);
    setOpen(false);
    navigate('/'); // Navigate to dashboard
    toast({
      title: "Client Account Switched",
      description: `You are now viewing ${clients.find(c => c.id === clientId)?.name}`
    });
  };

  const handleLogout = () => {
    switchToClient(null);
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("flex items-center gap-2", triggerClassName)}>
          {isInMasterMode ? (
            <>
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Master Account</span>
              <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <ShieldCheck className="h-3 w-3 mr-1" /> Admin
              </Badge>
            </>
          ) : currentClient ? (
            <>
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentClient.logo} alt={currentClient.name} />
                <AvatarFallback>{currentClient.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium max-w-[150px] truncate">{currentClient.name}</span>
              <Badge variant="outline" className="ml-1 bg-green-100 text-green-800 hover:bg-green-100">
                Client
              </Badge>
            </>
          ) : (
            <span>Select Account</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleSwitchToMaster}
        >
          <Building2 className="h-4 w-4" />
          <span>Master Account</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Client Accounts</DropdownMenuLabel>
        {clients.map(client => (
          <DropdownMenuItem
            key={client.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleSwitchToClient(client.id)}
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={client.logo} alt={client.name} />
              <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="truncate">{client.name}</span>
          </DropdownMenuItem>
        ))}
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
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Helper function to conditionally add classes
function cn(...classes: any) {
  return classes.filter(Boolean).join(' ');
}
