
import { useState, useEffect } from 'react';
import { Client } from '@/types/masterAccount';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { toast } from "@/hooks/use-toast";

export function useClients(initialClientData?: Client[]) {
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return savedClients ? JSON.parse(savedClients) : initialClientData || [];
  });
  
  const [currentClientId, setCurrentClientId] = useState<number | null>(() => {
    const savedClientId = localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT);
    return savedClientId ? JSON.parse(savedClientId) : null;
  });

  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.MASTER_MODE);
    return savedMode ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT, JSON.stringify(currentClientId));
  }, [currentClientId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_MODE, JSON.stringify(isInMasterMode));
  }, [isInMasterMode]);

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = {
      ...client,
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1
    };
    
    setClients([...clients, newClient]);
  };

  const removeClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
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

  return {
    clients,
    currentClientId,
    isInMasterMode,
    addClient,
    removeClient,
    switchToClient,
    toggleMasterMode,
    loginToAccount
  };
}
