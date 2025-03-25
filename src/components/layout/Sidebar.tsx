
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, PieChart, Calendar as CalendarIcon, Settings, Briefcase, BookOpen, Cable, Star, Send, HelpCircle, MessageCircle, Bot } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '../theme/ThemeProvider';
import darkLogoImage from '/lovable-uploads/0e3b9242-069b-4a19-b5ad-8f96b69d7d54.png';
import lightLogoImage from '/lovable-uploads/cef2e73a-adb7-41f2-9326-c41648b8d07d.png';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const { theme } = useTheme();
  
  // Determine which logo to use based on the theme
  const logoImage = theme === 'dark' ? lightLogoImage : darkLogoImage;
  
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      setIsExpanded(savedState === 'true');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', String(isExpanded));
  }, [isExpanded]);
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    toast({
      title: isExpanded ? "Sidebar collapsed" : "Sidebar expanded",
      duration: 1500,
    });
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleDocumentation = () => {
    toast({
      title: "Documentation",
      description: "Opening documentation in a new tab",
      duration: 2000,
    });
    window.open('https://docs.example.com', '_blank');
  };
  
  return (
    <div className={cn("fixed left-0 top-0 h-screen bg-sidebar border-r border-border transition-all duration-300 z-30", isExpanded ? "w-64" : "w-16")}>
      <div className="flex flex-col h-full">
        <div className={cn("flex items-center", isExpanded ? "p-4 justify-between" : "p-2 justify-center")}>
          {isExpanded ? 
            <div className="flex items-center h-16">
              <img 
                src={logoImage} 
                alt="Company Logo" 
                className="w-full h-auto max-h-full object-contain" 
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              />
            </div> 
            : 
            <div className="h-10 w-10 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Company Logo" 
                className="max-w-full max-h-full object-contain" 
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              />
            </div>
          }
          <button 
            onClick={toggleSidebar} 
            className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0 hover:bg-accent transition-colors"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("transform transition-transform", isExpanded ? "" : "rotate-180")}>
              <path d="M10.5 3.5L5.5 8L10.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            <li>
              <Link to="/" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <LayoutDashboard className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link to="/contacts" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/contacts") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Users className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Contacts</span>}
              </Link>
            </li>
            <li>
              <Link to="/opportunities" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/opportunities") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Briefcase className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Opportunities</span>}
              </Link>
            </li>
            <li>
              <Link to="/pipeline" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/pipeline") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <PieChart className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Pipeline</span>}
              </Link>
            </li>
            <li>
              <Link to="/calendar" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/calendar") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <CalendarIcon className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Calendar</span>}
              </Link>
            </li>
            <li>
              <Link to="/conversations" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/conversations") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <MessageCircle className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Conversations</span>}
              </Link>
            </li>
            <li>
              <Link to="/reputation" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/reputation") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Star className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Reputation</span>}
              </Link>
            </li>
            <li>
              <Link to="/content-scheduling" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/content-scheduling") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Send className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Content Scheduling</span>}
              </Link>
            </li>
            <li>
              <Link to="/integrations" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/integrations") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Cable className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Integrations</span>}
              </Link>
            </li>
            <li>
              <Link to="/chatbot" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/chatbot") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Bot className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Chatbot</span>}
              </Link>
            </li>
            <li>
              <Link to="/settings" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/settings") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Settings className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          {isExpanded && (
            <div className="rounded-lg bg-accent/50 p-4 cursor-pointer hover:bg-accent/70 transition-colors" onClick={handleDocumentation}>
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="h-5 w-5" />
                <h4 className="font-medium">Need Help?</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Check our documentation to get the most out of your CRM.
              </p>
              <span className="text-xs text-primary hover:underline">
                View Documentation →
              </span>
            </div>
          )}
          {!isExpanded && (
            <div className="flex justify-center">
              <button
                onClick={handleDocumentation}
                className="p-2 rounded-full hover:bg-accent/50 transition-colors"
                aria-label="Documentation"
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
