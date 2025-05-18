
import { useState, useEffect } from 'react';
import { Client } from '@/types/masterAccount';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { toast } from "@/hooks/use-toast";

export function useClients(initialClientData?: Client[]) {
  // const [clients, setClients] = useState<Client[]>(() => {
  //   const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  //   return savedClients ? JSON.parse(savedClients) : initialClientData || [];
  // });
  const [clients, setClients] = useState<Client[]>([]);

  // const [currentClientId, setCurrentClientId] = useState<number | null>(() => {
  //   const savedClientId = localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT);
  //   return savedClientId ? JSON.parse(savedClientId) : null;
  // });
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  // const [isInMasterMode, setIsInMasterMode] = useState<boolean>(() => {
  //   const savedMode = localStorage.getItem(STORAGE_KEYS.MASTER_MODE);
  //   return savedMode ? JSON.parse(savedMode) : true;
  // });

  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  // }, [clients]);

  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT, JSON.stringify(currentClientId));
  // }, [currentClientId]);

  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEYS.MASTER_MODE, JSON.stringify(isInMasterMode));
  // }, [isInMasterMode]);

  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(true);

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
  };

  return {
    clients,
    currentClientId,
    isInMasterMode,
    addClient,
    removeClient,
    switchToClient,
    toggleMasterMode,
    loginToAccount,
    clearAllClients
  };
}
