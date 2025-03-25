
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ChatDrawer } from "./components/chatbot/ChatDrawer";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Pipeline from "./pages/Pipeline";
import Calendar from "./pages/Calendar";
import Opportunities from "./pages/Opportunities";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import Reputation from "./pages/Reputation";
import ContentScheduling from "./pages/ContentScheduling";
import ChatbotManagement from "./pages/ChatbotManagement";
import Conversations from "./pages/Conversations";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [knowledgeBase, setKnowledgeBase] = useState([
    "The CRM system helps manage contacts and leads.",
    "You can schedule meetings and set reminders for follow-ups.",
    "The pipeline view shows all deals in progress and their status."
  ]);

  useEffect(() => {
    setMounted(true);
    
    // Get sidebar state from localStorage if available
    const savedSidebarState = localStorage.getItem('sidebar-expanded');
    if (savedSidebarState) {
      setSidebarExpanded(savedSidebarState === 'true');
    }
  }, []);

  const handleAddKnowledge = (knowledge: string) => {
    setKnowledgeBase(prev => [...prev, knowledge]);
  };

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="crm-theme">
        <BrowserRouter>
          <TooltipProvider>
            <ErrorBoundary>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className={`flex flex-col flex-1 overflow-x-hidden transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}>
                  <Navbar />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/pipeline" element={<Pipeline />} />
                      <Route path="/opportunities" element={<Opportunities />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/integrations" element={<Integrations />} />
                      <Route path="/reputation" element={<Reputation />} />
                      <Route path="/content-scheduling" element={<ContentScheduling />} />
                      <Route path="/chatbot" element={<ChatbotManagement knowledgeBase={knowledgeBase} onAddKnowledge={handleAddKnowledge} />} />
                      <Route path="/conversations" element={<Conversations />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
                <ChatDrawer knowledgeBase={knowledgeBase} onAddKnowledge={handleAddKnowledge} />
              </div>
            </ErrorBoundary>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
