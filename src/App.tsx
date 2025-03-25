
import { ErrorBoundary } from "react-error-boundary"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "@/components/theme/ThemeProvider"
import Calendar from "@/pages/Calendar"
import Index from "@/pages/Index"
import NotFound from "@/pages/NotFound"
import { MasterAccountProvider } from "@/contexts/MasterAccountContext"
import { Toaster } from "@/components/ui/toaster"
import Layout from "@/components/layout/Sidebar"
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
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
                    <Layout>
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
                    <Layout>
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
                    <Layout>
                      <div>Account</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Campaigns</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Clients</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Content</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deals"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Deals</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/email"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Email</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/integrations"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Integrations</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Notifications</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Projects</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Settings</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Social</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Tasks</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/webhooks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Webhooks</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/website"
                element={
                  <ProtectedRoute>
                    <Layout>
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
