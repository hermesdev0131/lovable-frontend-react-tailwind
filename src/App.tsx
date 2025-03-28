
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DealsProvider } from '@/contexts/DealsContext';
import { TasksProvider } from '@/contexts/TasksContext';
import { MasterAccountProvider } from '@/contexts/MasterAccountContext';
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
import Clients from './pages/Clients';
import MasterAccount from './pages/MasterAccount';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import CustomErrorBoundary from '@/components/CustomErrorBoundary';
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Sidebar from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import WebsiteManagement from './pages/WebsiteManagement';
import EmailMarketing from './pages/EmailMarketing';
import Content from './pages/Content';

function App() {
  // State for chatbot knowledge base
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>([
    "Our company operates Monday to Friday, 9am to 5pm.",
    "Our main office is located at 123 Business Avenue, Tech City.",
    "We offer a 30-day money-back guarantee on all our products.",
    "Customer support can be reached at support@example.com.",
  ]);

  const handleAddKnowledge = (knowledge: string) => {
    setKnowledgeBase(prev => [...prev, knowledge]);
  };

  // Sidebar state
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="crm-theme">
        <CustomErrorBoundary>
          <MasterAccountProvider>
            <DealsProvider>
              <TasksProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Layout Route */}
                  <Route 
                    element={
                      <ProtectedRoute>
                        <Sidebar 
                          isExpanded={sidebarExpanded} 
                          onToggle={toggleSidebar}
                        >
                          <Outlet />
                        </Sidebar>
                      </ProtectedRoute>
                    }
                  >
                    {/* Protected routes inside layout */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Index />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/social-media" element={<SocialMediaIntegration />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/website" element={<WebsiteManagement />} />
                    <Route path="/email" element={<EmailMarketing />} />
                    <Route path="/content" element={<Content />} />
                    <Route path="/chatbot" element={
                      <ChatbotManagement 
                        knowledgeBase={knowledgeBase} 
                        onAddKnowledge={handleAddKnowledge} 
                      />
                    } />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/master-account" element={<MasterAccount />} />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TasksProvider>
            </DealsProvider>
          </MasterAccountProvider>
        </CustomErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

export default App;
