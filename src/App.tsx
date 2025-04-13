import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { MasterAccountProvider } from './contexts/MasterAccountContext';
import MainLayout from './layouts/MainLayout';
import RoutesComponent from './RoutesComponent';
import { Toast } from "@/components/ui/toast"
import { DealsProvider } from './contexts/DealsContext';

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
