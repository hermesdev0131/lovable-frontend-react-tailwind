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
import Pipeline from "./pages/Pipeline"
import Reputation from "./pages/Reputation"
import Projects from "./pages/Projects"
import ContentScheduling from "./pages/ContentScheduling"

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
                      <div className="container mx-auto py-6">
                        <h1 className="text-3xl font-bold mb-6">Account</h1>
                        <p>Account management page content will go here.</p>
                      </div>
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
                      <div className="container mx-auto py-6">
                        <h1 className="text-3xl font-bold mb-6">Clients</h1>
                        <p>Client management page content will go here.</p>
                      </div>
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
                      <div className="container mx-auto py-6">
                        <h1 className="text-3xl font-bold mb-6">Deals</h1>
                        <p>Deal management page content will go here.</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/email"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div className="container mx-auto py-6">
                        <h1 className="text-3xl font-bold mb-6">Email</h1>
                        <p>Email management page content will go here.</p>
                      </div>
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
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <div className="container mx-auto py-6">
                        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
                        <p>Notification management page content will go here.</p>
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
                path="/pipeline"
                element={
                  <ProtectedRoute>
                    <Layout isExpanded={sidebarExpanded} onToggle={toggleSidebar}>
                      <Pipeline />
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
              
              {/* The 404 route doesn't need to be protected */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CustomErrorBoundary>
        </BrowserRouter>
      </MasterAccountProvider>
    </ThemeProvider>
  );
}

export default App;
