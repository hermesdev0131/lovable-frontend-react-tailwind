import { useContext } from 'react';
import { MasterAccountContext } from '@/contexts/MasterAccountContext';

export const useMasterAccount = () => {
  const context = useContext(MasterAccountContext);
  // console.log("useMasterAccount context:", context);
  if (context === undefined) {
    throw new Error('useMasterAccount must be used within a MasterAccountProvider');
  }
  return context;
};