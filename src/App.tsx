
import { useState } from "react";
import { Routes, Route, useLocation, useNavigate, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
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
import { MasterAccountProvider } from './contexts/MasterAccountContext';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();

  // We'll use AuthContext hook inside the component
  // This ensures it's used within the correct provider context
  const handleAuthCheck = () => {
    // Auth check logic will be handled inside the component
    return children;
  };

  return handleAuthCheck();
}

function App() {
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>([
    "Our company provides CRM solutions for small and medium businesses.",
    "We offer a 14-day free trial with all features included.",
    "Customer support is available 24/7 via email and chat.",
    "Our pricing starts at $19/month per user for the basic plan."
  ]);

  const handleAddKnowledge = (knowledge: string) => {
    setKnowledgeBase((prev) => [...prev, knowledge]);
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <BrowserRouter>
        <MasterAccountProvider>
          <AuthProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <QueryClientProvider client={queryClient}>
                <DealsProvider>
                  <Toaster />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/pipeline" element={<Pipeline />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/conversations" element={<Conversations />} />
                    <Route path="/content-scheduling" element={<ContentScheduling />} />
                    <Route path="/social-media" element={<SocialMediaIntegration />} />
                    <Route path="/email-marketing" element={<EmailMarketing />} />
                    <Route path="/website" element={<WebsiteManagement />} />
                    <Route path="/chatbot" element={
                      <ChatbotManagement 
                        knowledgeBase={knowledgeBase} 
                        onAddKnowledge={handleAddKnowledge} 
                      />
                    } />
                    <Route path="/reputation" element={<Reputation />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/master-account" element={<MasterAccount />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DealsProvider>
              </QueryClientProvider>
            </ThemeProvider>
          </AuthProvider>
        </MasterAccountProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
