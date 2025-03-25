
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
  subscription: string;
  status: string;
  users: number;
  deals: number;
  contacts: number;
  lastActivity: string;
  logo: string;
}

interface MasterAccountContextType {
  clients: Client[];
  currentClientId: number | null;
  addClient: (client: Omit<Client, 'id'>) => void;
  removeClient: (id: number) => void;
  switchToClient: (id: number | null) => void;
  isInMasterMode: boolean;
  toggleMasterMode: () => void;
}

const MasterAccountContext = createContext<MasterAccountContextType | undefined>(undefined);

export const MasterAccountProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([
    { 
      id: 1, 
      name: "Acme Corporation", 
      email: "admin@acme.com", 
      subscription: "Enterprise", 
      status: "active", 
      users: 12, 
      deals: 45, 
      contacts: 230, 
      lastActivity: "2023-09-15T10:30:00Z",
      logo: "/placeholder.svg"
    },
    { 
      id: 2, 
      name: "TechStart Inc", 
      email: "admin@techstart.com", 
      subscription: "Professional", 
      status: "active", 
      users: 5, 
      deals: 18, 
      contacts: 87, 
      lastActivity: "2023-09-14T16:45:00Z",
      logo: "/placeholder.svg"
    },
    { 
      id: 3, 
      name: "Global Services Ltd", 
      email: "admin@globalserv.com", 
      subscription: "Basic", 
      status: "inactive", 
      users: 3, 
      deals: 7, 
      contacts: 42, 
      lastActivity: "2023-09-10T09:15:00Z",
      logo: "/placeholder.svg"
    }
  ]);
  
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(true);

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = {
      ...client,
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1
    };
    
    setClients([...clients, newClient]);
  };

  const removeClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
    
    if (currentClientId === id) {
      setCurrentClientId(null);
      setIsInMasterMode(true);
    }
  };

  const switchToClient = (id: number | null) => {
    setCurrentClientId(id);
    setIsInMasterMode(id === null);
  };

  const toggleMasterMode = () => {
    setIsInMasterMode(!isInMasterMode);
    if (!isInMasterMode) {
      setCurrentClientId(null);
    }
  };

  return (
    <MasterAccountContext.Provider 
      value={{ 
        clients, 
        currentClientId, 
        addClient, 
        removeClient, 
        switchToClient,
        isInMasterMode,
        toggleMasterMode
      }}
    >
      {children}
    </MasterAccountContext.Provider>
  );
};

export const useMasterAccount = () => {
  const context = useContext(MasterAccountContext);
  if (context === undefined) {
    throw new Error('useMasterAccount must be used within a MasterAccountProvider');
  }
  return context;
};
