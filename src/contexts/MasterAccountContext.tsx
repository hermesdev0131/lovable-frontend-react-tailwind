
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

// Define the structure of a client object
export type Client = {
  id: number;
  name: string;
  email: string;
  password?: string;
  subscription: string;
  status: string;
  users: number;
  deals: number;
  contacts: number;
  lastActivity: string;
  logo: string;
};

// Define the context type
export type MasterAccountContextType = {
  isInMasterMode: boolean;
  setIsInMasterMode: (value: boolean) => void;
  currentClientId: number | null;
  clients: Client[];
  selectedClient: Client | null;
  switchToClient: (clientId: number | null) => void;
  loginToAccount: (email: string, password: string) => boolean;
  addClient: (client: Omit<Client, 'id'>) => void;
  removeClient: (id: number) => void;
};

// Create the context with a default value of null 
const MasterAccountContext = createContext<MasterAccountContextType | null>(null);

// Create a provider component
export const MasterAccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInMasterMode, setIsInMasterMode] = useState(false);
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Acme Corp",
      email: "info@acmecorp.com",
      subscription: "Professional",
      status: "active",
      users: 15,
      deals: 42,
      contacts: 120,
      lastActivity: "2024-01-20T14:30:00Z",
      logo: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Beta Industries",
      email: "contact@betaindustries.net",
      subscription: "Basic",
      status: "inactive",
      users: 5,
      deals: 12,
      contacts: 65,
      lastActivity: "2023-12-15T09:00:00Z",
      logo: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Gamma Solutions",
      email: "sales@gammasolutions.org",
      subscription: "Enterprise",
      status: "active",
      users: 50,
      deals: 150,
      contacts: 500,
      lastActivity: "2024-01-28T18:45:00Z",
      logo: "/placeholder.svg"
    }
  ]);

  // Find the selected client based on currentClientId
  const selectedClient = clients.find((client) => client.id === currentClientId) || null;

  // Function to switch to a different client
  const switchToClient = (clientId: number | null) => {
    setCurrentClientId(clientId);
  };

  const loginToAccount = (email: string, password: string): boolean => {
    if (email === "dej@avai.vip" && password === "FilthyRich2025!") {
      setIsInMasterMode(true);
      toast({
        title: "Login Successful",
        description: "You have logged in as the master account."
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    const newClient: Client = { id: newId, ...client };
    setClients([...clients, newClient]);
  };

  const removeClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
    if (currentClientId === id) {
      setCurrentClientId(null);
    }
  };

  // Provide the context value
  const contextValue: MasterAccountContextType = {
    isInMasterMode,
    setIsInMasterMode,
    currentClientId,
    clients,
    selectedClient,
    switchToClient,
    loginToAccount,
    addClient,
    removeClient,
  };

  return (
    <MasterAccountContext.Provider value={contextValue}>
      {children}
    </MasterAccountContext.Provider>
  );
};

// Create a hook to use the context
export const useMasterAccount = () => {
  const context = useContext(MasterAccountContext);
  if (!context) {
    throw new Error('useMasterAccount must be used within a MasterAccountProvider');
  }
  return context;
};
