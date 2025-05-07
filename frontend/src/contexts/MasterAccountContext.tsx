import React, { createContext, ReactNode, useContext } from 'react';
import { useClients } from '@/hooks/useClients';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useWebsitePages } from '@/hooks/useWebsitePages';
import { useNotifications } from '@/hooks/useNotifications';
import { useContentItems } from '@/hooks/useContentItems';
import { MasterAccountContextType } from '@/types/masterAccount';
import { initialClients } from '@/data/initialData';

export const MasterAccountContext = createContext<MasterAccountContextType | undefined>(undefined);

export const MasterAccountProvider = ({ children }: { children: ReactNode }) => {
  const { 
    clients, 
    currentClientId, 
    isInMasterMode, 
    addClient, 
    removeClient, 
    switchToClient,
    toggleMasterMode,
    loginToAccount
  } = useClients(initialClients);

  const {
    webhooks,
    addWebhook,
    removeWebhook,
    updateWebhook,
    triggerWebhook
  } = useWebhooks();

  const {
    notifications,
    addNotification,
    markNotificationAsRead,
    getNotifications,
    getUnreadNotificationsCount
  } = useNotifications(isInMasterMode, currentClientId);

  const {
    websitePages,
    addWebsitePage,
    removeWebsitePage,
    updateWebsitePage
  } = useWebsitePages(isInMasterMode, currentClientId);

  const {
    contentItems,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    updateContentStatus,
    getContentItems
  } = useContentItems(isInMasterMode, currentClientId, clients, addNotification);

  // Clean up websitePages and contentItems when removing a client
  const handleRemoveClient = (id: number) => {
    removeClient(id);
    
    // These operations are now handled in the main context instead of inside the hooks
    // to avoid circular dependencies
    if (currentClientId === id) {
      switchToClient(null);
    }
  };

  return (
    <MasterAccountContext.Provider 
      value={{ 
        clients, 
        currentClientId, 
        webhooks,
        websitePages,
        contentItems,
        notifications,
        addClient, 
        removeClient: handleRemoveClient, 
        switchToClient,
        isInMasterMode,
        toggleMasterMode,
        loginToAccount,
        addWebhook,
        removeWebhook,
        updateWebhook,
        triggerWebhook,
        addWebsitePage,
        removeWebsitePage,
        updateWebsitePage,
        addContentItem,
        updateContentItem,
        deleteContentItem,
        updateContentStatus,
        getContentItems,
        addNotification,
        markNotificationAsRead,
        getNotifications,
        getUnreadNotificationsCount
      }}
    >
      {children}
    </MasterAccountContext.Provider>
  );
};

export const useMasterAccount = () => {
	const context = useContext(MasterAccountContext);
	// console.log("useMasterAccount context:", context);
	if (context === undefined) {
		throw new Error('useMasterAccount must be used within a MasterAccountProvider');
	}
	return context;
};
