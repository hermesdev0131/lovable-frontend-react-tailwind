import React, { use } from 'react';
//import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { MasterAccountProvider } from './contexts/MasterAccountContext';
import { CustomFieldsProvider } from './contexts/CustomFieldsContext';
import Sidebar from '@/components/layout/Sidebar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { DealsProvider } from './contexts/DealsContext';
import { TasksProvider } from './contexts/TasksContext';
import Index from './pages/Index';
import Reputation from './pages/Reputation';
import Contacts from './pages/Contacts';
import MasterAccount from './pages/MasterAccount';
import Reports from './pages/Reports';
import ClientProfile from './pages/ClientProfile';  // Ensure correct import
import Deals from './pages/Deals';
import Login from './pages/Login';
import EmailMarketing from './pages/EmailMarketing';
import Calendar from './pages/Calendar';
import WebsiteManagement from './pages/WebsiteManagement';
import Socials from './pages/Content';
import Clients from './pages/Clients';
import SettingsPage from './pages/Settings';
import ChatbotManagement from './pages/ChatbotManagement';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
//import { useAuth } from '@/contexts/AuthContext';
//import { AuthCallback } from './components/auth/callback';

// MainLayout component inline since it was missing
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Sidebar isExpanded={isExpanded} onToggle={handleToggleSidebar}>
      {children}
    </Sidebar>
  );
};

const RoutesComponent = () => {
  return (
    <Routes>
      
			<Route path="/login" element={<Login />} />

			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<Index />} />
				<Route path="/login" element={<Login />} />
				<Route path="/reputation" element={<Socials />} />
				<Route path="/contacts" element={<Contacts />} />
				<Route path="/clients" element={<Clients />} />
				<Route path="/calendar" element={<Calendar />} />
				<Route path="/clients/:clientId" element={<ClientProfile />} />
				<Route path="/email" element={<EmailMarketing />} />
				<Route path="/website" element={<WebsiteManagement />} />
				<Route path="/socials" element={<Socials />} />
				<Route path="/reports" element={<Reports />} />
				<Route path="/master-account" element={<MasterAccount />} />
				<Route path="/deals" element={<Deals />} />
				<Route path="/settings" element={<SettingsPage />} />
			</Route>
      
      {/* <Route path="/help" element={<ChatbotManagement knowledgeBase={"Bo"}/>} /> */}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
				<AuthProvider>
					<MasterAccountProvider>
						<DealsProvider>
							<CustomFieldsProvider>
								<TasksProvider>
									<MainLayout>
										<RoutesComponent />
										<Toaster />
									</MainLayout>
								</TasksProvider>
							</CustomFieldsProvider>
						</DealsProvider>
					</MasterAccountProvider>
				</AuthProvider>
        
      </ThemeProvider>
    </Router>
  );
}


export default App;
