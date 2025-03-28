import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DealsProvider } from '@/contexts/DealsContext';
import { TasksProvider } from '@/contexts/TasksContext';
import Index from './pages/Index';
import Deals from './pages/Deals';
import Contacts from './pages/Contacts';
import Opportunities from './pages/Opportunities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SocialMediaIntegration from './pages/SocialMediaIntegration';
import Integrations from './pages/Integrations';
import ChatbotManagement from './pages/ChatbotManagement';
import CalendarPage from './pages/Calendar';
import CustomErrorBoundary from '@/components/CustomErrorBoundary';
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="crm-theme">
        <CustomErrorBoundary>
          <DealsProvider>
            <TasksProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/social-media" element={<SocialMediaIntegration />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/chatbot" element={<ChatbotManagement />} />
                <Route path="/calendar" element={<CalendarPage />} />
              </Routes>
            </TasksProvider>
          </DealsProvider>
        </CustomErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

export default App;
