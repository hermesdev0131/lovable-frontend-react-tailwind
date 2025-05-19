
import { useState, useEffect } from 'react';
import { Client } from '@/types/masterAccount';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { toast } from "@/hooks/use-toast";
import { config } from "@/config";

export function useClients(initialClientData?: Client[]) {
  // State for clients data
  const [clients, setClients] = useState<Client[]>([]);
  
  // State for tracking if clients have been loaded
  const [clientsLoaded, setClientsLoaded] = useState<boolean>(false);
  
  // State for loading status
  const [isLoadingClients, setIsLoadingClients] = useState<boolean>(false);

  // Current client ID
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  // Master mode state
  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(true);
  
  // Function to fetch clients from the API
  const fetchClientsData = async (): Promise<boolean> => {
    // If clients are already loaded or currently loading, don't fetch again
    if (clientsLoaded || isLoadingClients) {
      console.log("Clients already loaded or loading, skipping fetch");
      return true;
    }
    
    setIsLoadingClients(true);
    try {
      const response = await fetch(`${config.apiUrl}/contacts`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch clients');
      }
      
      const data = await response.json();
      console.log("Fetched clients data:", data);
      
      // Clear existing clients and add new ones
      clearAllClients();
      if (Array.isArray(data)) {
        data.forEach(client => {
          addClient(client);
        });
      }
      
      // Mark clients as loaded
      setClientsLoaded(true);
      setIsLoadingClients(false);
      return true;
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsLoadingClients(false);
      return false;
    }
  };

  const addClient = (client: Client) => {
    const newClient: Client = {
      ...client,
      id: client.id || (clients.length > 0 ? (parseInt(clients[clients.length - 1].id) + 1).toString() : "1")
    };
    
    // setClients([...clients, newClient]);
    // Check if this is a new client or an existing one
    // const existingClientIndex = clients.findIndex(c => 
    //   c.firstName === client.firstName && 
    //   c.lastName === client.lastName &&
    //   c.emails.some(email => client.emails.includes(email))
    // );
    
    // if (existingClientIndex >= 0) {
    //   // Update existing client
    //   const updatedClients = [...clients];
    //   updatedClients[existingClientIndex] = { ...newClient, id: clients[existingClientIndex].id };
    //   setClients(updatedClients);
    // } else {
    //   // Add new client
    //   setClients([...clients, newClient]);
    // }

    setClients(prev => [...prev, newClient]);
  };



  const removeClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const switchToClient = (id: string | null) => {
    setCurrentClientId(id);
    setIsInMasterMode(id === null);
  };

  const toggleMasterMode = () => {
    setIsInMasterMode(!isInMasterMode);
    if (!isInMasterMode) {
      setCurrentClientId(null);
    }
  };

  const loginToAccount = (email: string, password: string): boolean => {
    if ((email === "dej@avai.vip" || email === "baba@avai.vip") && password === "FilthyRich2025!") {
      setCurrentClientId(null);
      setIsInMasterMode(true);
      toast({
        title: "Logged In",
        description: "Successfully logged in to master account."
      });
      return true;
    }
    
    const client = clients.find(client => client.emails.includes(email));
    if (client) {
      setCurrentClientId(client.id);
      setIsInMasterMode(false);
      toast({
        title: "Logged In",
        description: `Successfully logged in to ${client.firstName} ${client.lastName}'s account.`
      });
      return true;
    }
    
    //toast({
    //  title: "Login Failed",
    //  description: "Invalid email. Please try again.",
    //  variant: "destructive"
    //});
    return false;
  };

  // Add a method to clear all clients
  const clearAllClients = () => {
    setClients([]);
    setClientsLoaded(false);
  };
  
  // Add a method to refresh clients without affecting the loaded state
  const refreshClientsData = async (): Promise<boolean> => {
    setIsLoadingClients(true);
    try {
      const response = await fetch(`${config.apiUrl}/contacts`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch clients');
      }
      
      const data = await response.json();
      console.log("Refreshed clients data:", data);
      
      // Update clients without changing clientsLoaded state
      setClients(Array.isArray(data) ? data : []);
      
      setIsLoadingClients(false);
      return true;
    } catch (error) {
      console.error("Error refreshing clients:", error);
      setIsLoadingClients(false);
      return false;
    }
  };

  return {
    clients,
    currentClientId,
    isInMasterMode,
    isLoadingClients,
    clientsLoaded,
    addClient,
    removeClient,
    switchToClient,
    toggleMasterMode,
    loginToAccount,
    clearAllClients,
    fetchClientsData,
    refreshClientsData
  };
}
