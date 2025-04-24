import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { MasterAccountProvider } from './contexts/MasterAccountContext';
import { CustomFieldsProvider } from './contexts/CustomFieldsContext';
import Sidebar from '@/components/layout/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { DealsProvider } from './contexts/DealsContext';
import { TasksProvider } from './contexts/TasksContext';
import Index from './pages/Index';
import Reputation from './pages/Reputation';
import Contacts from './pages/Contacts';
import MasterAccount from './pages/MasterAccount';
import Reports from './pages/Reports';
import ClientProfile from './pages/ClientProfile';  // Ensure correct import
import Deals from './pages/Deals';
import Login from './pages/Login';
import EmailMarketing from './pages/EmailMarketing';
import Calendar from './pages/Calendar';
import WebsiteManagement from './pages/WebsiteManagement';
import Socials from './pages/Content';
import Clients from './pages/Clients';
import SettingsPage from './pages/Settings';

// MainLayout component inline since it was missing
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Sidebar isExpanded={isExpanded} onToggle={handleToggleSidebar}>
      {children}
    </Sidebar>
  );
};

// RoutesComponent to handle application routing
const RoutesComponent = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reputation" element={<Reputation />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/clients/:clientId" element={<ClientProfile />} />
      <Route path="/email" element={<EmailMarketing />} />
      <Route path="/website" element={<WebsiteManagement />} />
      <Route path="/content" element={<Socials />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/master-account" element={<MasterAccount />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MasterAccountProvider>
          <DealsProvider>
            <CustomFieldsProvider>
              <TasksProvider>
                <MainLayout>
                  <RoutesComponent />
                  <Toaster />
                </MainLayout>
              </TasksProvider>
            </CustomFieldsProvider>
          </DealsProvider>
        </MasterAccountProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
