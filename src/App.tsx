
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "@/components/theme/ThemeProvider"
import Calendar from "@/pages/Calendar"
import Index from "@/pages/Index"
import NotFound from "@/pages/NotFound"
import { MasterAccountProvider } from "@/contexts/MasterAccountContext"
import { Toaster } from "@/components/ui/toaster"
import Layout from "@/components/layout/Sidebar"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import CustomErrorBoundary from "./components/CustomErrorBoundary"
import { useState } from "react"
import MasterAccount from "./pages/MasterAccount"
import SettingsPage from "./pages/Settings"
import Opportunities from "./pages/Opportunities"
import Projects from "./pages/Projects"
import ContentScheduling from "./pages/ContentScheduling"
import Clients from "./pages/Clients"
import Deals from "./pages/Deals"
import WebsiteManagement from "./pages/WebsiteManagement"
import EmailMarketing from "./pages/EmailMarketing"
import Reputation from "./pages/Reputation"
import Account from "./pages/Account"
import Login from "./pages/Login"

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <MasterAccountProvider>
        <BrowserRouter>
          <CustomErrorBoundary>
            <Toaster />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Index />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Calendar />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Account />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div className="container mx-auto py-6">
                        <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
                        <p>Campaign management page content will go here.</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Clients />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/content"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <ContentScheduling />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/deals"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Deals />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/email"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <EmailMarketing />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/integrations"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div className="container mx-auto py-6">
                        <h1 className="text-3xl font-bold mb-6">Integrations</h1>
                        <p>Integration management page content will go here.</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/opportunities"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Opportunities />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Projects />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reputation"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Reputation />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Tasks</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/website"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <WebsiteManagement />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/master-account"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <MasterAccount />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="*"
                element={<NotFound />}
              />
            </Routes>
          </CustomErrorBoundary>
        </BrowserRouter>
      </MasterAccountProvider>
    </ThemeProvider>
  );
}

export default App;
