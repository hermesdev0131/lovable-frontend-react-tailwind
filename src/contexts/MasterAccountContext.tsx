
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  industry?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
}

interface MasterAccountContextType {
  clients: Client[];
  currentClientId: string | null;
  isInMasterMode: boolean;
  setCurrentClient: (clientId: string | null) => void;
  toggleMasterMode: () => void;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
}

const MasterAccountContext = createContext<MasterAccountContextType | undefined>(undefined);

export const MasterAccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('crm_master_clients');
    return savedClients ? JSON.parse(savedClients) : [
      { id: '1', name: 'Acme Corporation', industry: 'Technology', website: 'acme.com' },
      { id: '2', name: 'Globex Inc.', industry: 'Manufacturing', website: 'globex.com' },
      { id: '3', name: 'Soylent Corp', industry: 'Food & Beverage', website: 'soylent.com' },
    ];
  });

  const [currentClientId, setCurrentClientId] = useState<string | null>(() => {
    const savedClientId = localStorage.getItem('crm_current_client_id');
    return savedClientId || '1'; // Default to first client
  });

  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(() => {
    const savedMasterMode = localStorage.getItem('crm_is_master_mode');
    return savedMasterMode ? JSON.parse(savedMasterMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('crm_master_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    if (currentClientId) {
      localStorage.setItem('crm_current_client_id', currentClientId);
    } else {
      localStorage.removeItem('crm_current_client_id');
    }
  }, [currentClientId]);

  useEffect(() => {
    localStorage.setItem('crm_is_master_mode', JSON.stringify(isInMasterMode));
  }, [isInMasterMode]);

  const setCurrentClient = (clientId: string | null) => {
    setCurrentClientId(clientId);
    
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        toast({
          title: "Client Changed",
          description: `Now working with ${client.name}`
        });
      }
    }
  };

  const toggleMasterMode = () => {
    setIsInMasterMode(prev => !prev);
    toast({
      title: isInMasterMode ? "Master Mode Disabled" : "Master Mode Enabled",
      description: isInMasterMode 
        ? "You are now operating on a client account" 
        : "You can now manage all client accounts"
    });
  };

  const addClient = (clientData: Omit<Client, "id">) => {
    const newClient = {
      ...clientData,
      id: Date.now().toString()
    };
    
    setClients(prev => [...prev, newClient]);
    toast({
      title: "Client Added",
      description: `${clientData.name} has been added successfully`
    });
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => 
      prev.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    
    toast({
      title: "Client Updated",
      description: `${updatedClient.name} has been updated successfully`
    });
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    
    // If the deleted client is the current client, switch to the first available client
    if (currentClientId === clientId) {
      const remainingClients = clients.filter(client => client.id !== clientId);
      if (remainingClients.length > 0) {
        setCurrentClient(remainingClients[0].id);
      } else {
        setCurrentClient(null);
      }
    }
    
    toast({
      title: "Client Deleted",
      description: "The client has been removed successfully"
    });
  };

  return (
    <MasterAccountContext.Provider 
      value={{ 
        clients, 
        currentClientId, 
        isInMasterMode,
        setCurrentClient,
        toggleMasterMode,
        addClient,
        updateClient,
        deleteClient
      }}
    >
      {children}
    </MasterAccountContext.Provider>
  );
};

export const useMasterAccount = (): MasterAccountContextType => {
  const context = useContext(MasterAccountContext);
  if (context === undefined) {
    throw new Error('useMasterAccount must be used within a MasterAccountProvider');
  }
  return context;
};
