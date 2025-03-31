
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { DealFormField } from '@/components/deals/DealForm';

interface CustomFieldsContextType {
  dealFields: DealFormField[];
  updateDealFields: (fields: DealFormField[]) => void;
  getFieldsForAccount: (accountId: string) => DealFormField[];
  setFieldsForAccount: (accountId: string, fields: DealFormField[]) => void;
}

const CustomFieldsContext = createContext<CustomFieldsContextType | undefined>(undefined);

const STORAGE_KEY = 'crm_custom_fields';

export const CustomFieldsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dealFields, setDealFields] = useState<DealFormField[]>([]);
  const [accountFields, setAccountFields] = useState<Record<string, DealFormField[]>>({});
  
  // Load custom fields from localStorage on mount
  useEffect(() => {
    try {
      const savedFields = localStorage.getItem(STORAGE_KEY);
      if (savedFields) {
        const parsed = JSON.parse(savedFields);
        setDealFields(parsed.dealFields || []);
        setAccountFields(parsed.accountFields || {});
      }
    } catch (error) {
      console.error("Error loading custom fields:", error);
    }
  }, []);
  
  // Save to localStorage whenever fields change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      dealFields,
      accountFields
    }));
  }, [dealFields, accountFields]);
  
  const updateDealFields = (fields: DealFormField[]) => {
    setDealFields(fields);
  };
  
  const getFieldsForAccount = (accountId: string): DealFormField[] => {
    return accountFields[accountId] || dealFields;
  };
  
  const setFieldsForAccount = (accountId: string, fields: DealFormField[]) => {
    setAccountFields(prev => ({
      ...prev,
      [accountId]: fields
    }));
  };
  
  return (
    <CustomFieldsContext.Provider
      value={{
        dealFields,
        updateDealFields,
        getFieldsForAccount,
        setFieldsForAccount
      }}
    >
      {children}
    </CustomFieldsContext.Provider>
  );
};

export const useCustomFields = (): CustomFieldsContextType => {
  const context = useContext(CustomFieldsContext);
  if (context === undefined) {
    throw new Error('useCustomFields must be used within a CustomFieldsProvider');
  }
  return context;
};
