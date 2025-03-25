
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Pipeline from "./pages/Pipeline";
import Calendar from "./pages/Calendar";
import Opportunities from "./pages/Opportunities";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

const queryClient = new QueryClient();

const App = () => {
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Get sidebar state from localStorage if available
    const savedSidebarState = localStorage.getItem('sidebar-expanded');
    if (savedSidebarState) {
      setSidebarExpanded(savedSidebarState === 'true');
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
