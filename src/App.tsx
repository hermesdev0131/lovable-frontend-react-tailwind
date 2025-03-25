
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "@/components/theme/ThemeProvider"
import Calendar from "@/pages/Calendar"
import Index from "@/pages/Index"
import NotFound from "@/pages/NotFound"
import { MasterAccountProvider } from "@/contexts/MasterAccountContext"
import { Toaster } from "@/components/ui/toaster"
import Layout from "@/components/layout/Sidebar"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import ErrorBoundary from "./components/ErrorBoundary"
import { useState } from "react"

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <MasterAccountProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Toaster />
            <Routes>
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
              
              {/* Protect all other routes with ProtectedRoute */}
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
              
              {/* Protect all other routes with ProtectedRoute */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Account</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Campaigns</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Clients</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Content</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deals"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Deals</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/email"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Email</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/integrations"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Integrations</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Notifications</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Projects</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Settings</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Social</div>
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
                path="/webhooks"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Webhooks</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/website"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div>Website</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* The 404 route doesn't need to be protected */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </MasterAccountProvider>
    </ThemeProvider>
  );
}

export default App
