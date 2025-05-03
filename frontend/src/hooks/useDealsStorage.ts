
import { useState, useEffect } from 'react';
import { Deal, STORAGE_KEYS } from '@/components/deals/types';

export const useDealsStorage = () => {
  const [deals, setDeals] = useState<Deal[]>(() => {
    // Load deals from localStorage on initial mount
    const savedDeals = localStorage.getItem(STORAGE_KEYS.DEALS_DATA);
    return savedDeals ? JSON.parse(savedDeals) : [];
  });

  // Save deals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEALS_DATA, JSON.stringify(deals));
  }, [deals]);

  const addDeal = (deal: Deal) => {
    setDeals((currentDeals) => {
      const newDeals = [...currentDeals, deal];
      // Ensure immediate storage to localStorage
      localStorage.setItem(STORAGE_KEYS.DEALS_DATA, JSON.stringify(newDeals));
      return newDeals;
    });
  };

  const updateDeal = (updatedDeal: Deal) => {
    setDeals((currentDeals) => {
      const newDeals = currentDeals.map((deal) => 
        deal.id === updatedDeal.id ? updatedDeal : deal
      );
      // Ensure immediate storage to localStorage
      localStorage.setItem(STORAGE_KEYS.DEALS_DATA, JSON.stringify(newDeals));
      return newDeals;
    });
  };

  const deleteDeal = (id: string) => {
    setDeals((currentDeals) => {
      const newDeals = currentDeals.filter((deal) => deal.id !== id);
      // Ensure immediate storage to localStorage
      localStorage.setItem(STORAGE_KEYS.DEALS_DATA, JSON.stringify(newDeals));
      return newDeals;
    });
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
