
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/toaster";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Clients from "./pages/Clients";
import Contacts from "./pages/Contacts";
import Opportunities from "./pages/Opportunities";
import Deals from "./pages/Deals";
import Pipeline from "./pages/Pipeline";
import Calendar from "./pages/Calendar";
import Projects from "./pages/Projects";
import Conversations from "./pages/Conversations";
import ContentScheduling from "./pages/ContentScheduling";
import SocialMediaIntegration from "./pages/SocialMediaIntegration";
import EmailMarketing from "./pages/EmailMarketing";
import WebsiteManagement from "./pages/WebsiteManagement";
import ChatbotManagement from "./pages/ChatbotManagement";
import Reputation from "./pages/Reputation";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import MasterAccount from "./pages/MasterAccount";
import NotFound from "./pages/NotFound";
import { DealsProvider } from './contexts/DealsContext';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
    }
  }, [currentUser, location, navigate]);

  return currentUser ? children : null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
      <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
      <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
      <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/conversations" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
      <Route path="/content-scheduling" element={<ProtectedRoute><ContentScheduling /></ProtectedRoute>} />
      <Route path="/social-media" element={<ProtectedRoute><SocialMediaIntegration /></ProtectedRoute>} />
      <Route path="/email-marketing" element={<ProtectedRoute><EmailMarketing /></ProtectedRoute>} />
      <Route path="/website" element={<ProtectedRoute><WebsiteManagement /></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><ChatbotManagement /></ProtectedRoute>} />
      <Route path="/reputation" element={<ProtectedRoute><Reputation /></ProtectedRoute>} />
      <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/master-account" element={<ProtectedRoute><MasterAccount /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <QueryClientProvider client={queryClient}>
              <DealsProvider>
                <Toaster />
                <AppRoutes />
              </DealsProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
