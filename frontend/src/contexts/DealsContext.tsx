import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Deal } from '@/components/deals/types';
import { useDealsStorage } from '@/hooks/useDealsStorage';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@/config';
import { toast } from '@/hooks/use-toast';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id'> & { id?: string }) => void;
  updateDeal: (deal: Deal) => void;
  deleteDeal: (id: string) => void;
  getDealById: (id: string) => Deal | null;
  fetchDealsData: () => Promise<boolean>;
  refreshDealsData: () => Promise<boolean>;
  isLoadingDeals: boolean;
  dealsLoaded: boolean;
  clearAllDeals: () => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { deals, addDeal: addDealToStorage, updateDeal, deleteDeal, getDealById, clearDeals } = useDealsStorage();
  const [isLoadingDeals, setIsLoadingDeals] = useState<boolean>(false);
  const [dealsLoaded, setDealsLoaded] = useState<boolean>(false);

  const clearAllDeals = () => {
    clearDeals();
    setDealsLoaded(false);
  };

  const fetchDealsData = async (): Promise<boolean> => {
    // Add more detailed logging to help with debugging
    console.log("fetchDealsData called. Current state:", { dealsLoaded, isLoadingDeals });
    
    if (dealsLoaded || isLoadingDeals) {
      console.log("Deals already loaded or loading, skipping fetch");
      return true;
    }

    console.log("Starting deals fetch...");
    setIsLoadingDeals(true);
    try {
      clearAllDeals();

      const response = await fetch(`${config.apiUrl}/deals`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch deals');
      }
      
      const data = await response.json();
      console.log("Fetched deals data:", data.length, "items");
      
      if (Array.isArray(data)) {
        data.forEach(deal => {
          addDealToStorage(deal);
        });
      }
      
      console.log("Deals fetch completed successfully");
      setDealsLoaded(true);
      setIsLoadingDeals(false);
      return true;
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast({
        title: "Error",
        description: "Failed to load deals data",
        variant: "destructive"
      });
      setIsLoadingDeals(false);
      return false;
    }
  };

  const refreshDealsData = async (): Promise<boolean> => {
    console.log("refreshDealsData called - explicitly refreshing deals data");
    setIsLoadingDeals(true);
    try {
      const response = await fetch(`${config.apiUrl}/deals`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch deals');
      }
      
      const data = await response.json();
      console.log("Refreshed deals data:", data.length, "items");
      
      clearAllDeals();
      if (Array.isArray(data)) {
        data.forEach(deal => {
          addDealToStorage(deal);
        });
      }
      
      console.log("Deals refresh completed successfully");
      setDealsLoaded(true);
      setIsLoadingDeals(false);
      return true;
    } catch (error) {
      console.error("Error refreshing deals:", error);
      toast({
        title: "Error",
        description: "Failed to refresh deals data",
        variant: "destructive"
      });
      setIsLoadingDeals(false);
      return false;
    }
  };

  const addDeal = (dealData: Omit<Deal, 'id'> & { id?: string }) => {
    const now = new Date().toISOString();
    const newDeal: Deal = {
      ...dealData,
      id: dealData.id || uuidv4(),
      createdAt: dealData.createdAt || now,
      updatedAt: dealData.updatedAt || now
    };
    addDealToStorage(newDeal);
  };

  return (
    <DealsContext.Provider
      value={{
        deals,
        addDeal,
        updateDeal,
        deleteDeal,
        getDealById,
        fetchDealsData,
        refreshDealsData,
        isLoadingDeals,
        dealsLoaded,
        clearAllDeals
      }}
    >
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = (): DealsContextType => {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};
