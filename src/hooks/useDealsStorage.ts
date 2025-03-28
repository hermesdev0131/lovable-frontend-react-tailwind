
import { useState, useEffect } from 'react';
import { Deal, STORAGE_KEYS } from '@/components/deals/types';

export const useDealsStorage = () => {
  const [deals, setDeals] = useState<Deal[]>(() => {
    const savedDeals = localStorage.getItem(STORAGE_KEYS.DEALS_DATA);
    return savedDeals ? JSON.parse(savedDeals) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEALS_DATA, JSON.stringify(deals));
  }, [deals]);

  const addDeal = (deal: Deal) => {
    setDeals((currentDeals) => [...currentDeals, deal]);
  };

  const updateDeal = (updatedDeal: Deal) => {
    setDeals((currentDeals) => 
      currentDeals.map((deal) => 
        deal.id === updatedDeal.id ? updatedDeal : deal
      )
    );
  };

  const deleteDeal = (id: string) => {
    setDeals((currentDeals) => currentDeals.filter((deal) => deal.id !== id));
  };

  const getDealById = (id: string) => {
    return deals.find((deal) => deal.id === id) || null;
  };

  return {
    deals,
    addDeal,
    updateDeal,
    deleteDeal,
    getDealById
  };
};
