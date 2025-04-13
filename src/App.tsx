
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { MasterAccountProvider } from './contexts/MasterAccountContext';
import Sidebar from '@/components/layout/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { Toast } from "@/components/ui/toast";
import { DealsProvider } from './contexts/DealsContext';
import Index from './pages/Index';
import Reputation from './pages/Reputation';

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
      <Route path="/reputation" element={<Reputation />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DealsProvider>
          <MasterAccountProvider>
            <MainLayout>
              <RoutesComponent />
              <Toast />
            </MainLayout>
          </MasterAccountProvider>
        </DealsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
