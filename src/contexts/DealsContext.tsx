
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Deal, Stage, STORAGE_KEYS } from '@/components/deals/types';
import { useDealsStorage } from '@/hooks/useDealsStorage';
import { v4 as uuidv4 } from 'uuid';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDeal: (deal: Deal) => void;
  deleteDeal: (id: string) => void;
  getDealById: (id: string) => Deal | null;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { deals, addDeal: addDealToStorage, updateDeal, deleteDeal, getDealById } = useDealsStorage();

  const addDeal = (dealData: Omit<Deal, 'id'>) => {
    const now = new Date().toISOString();
    const newDeal: Deal = {
      ...dealData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
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
        getDealById
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
