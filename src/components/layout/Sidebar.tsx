import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, PieChart, Calendar as CalendarIcon, Settings, Briefcase, BookOpen, Cable, Star, Send } from 'lucide-react';
const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
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
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <div className={cn("fixed left-0 top-0 h-screen bg-sidebar border-r border-border transition-all duration-300 z-30", isExpanded ? "w-64" : "w-16")}>
      <div className="flex flex-col h-full">
        <div className={cn("p-6 flex items-center", isExpanded ? "justify-between" : "justify-center")}>
          {isExpanded ? <div className="flex items-center">
              <img src="/lovable-uploads/0e3b9242-069b-4a19-b5ad-8f96b69d7d54.png" alt="MI Logo" className="h-8 w-auto object-fill" />
            </div> : <div className="h-8 w-8 flex items-center justify-center">
              <img src="/lovable-uploads/0e3b9242-069b-4a19-b5ad-8f96b69d7d54.png" alt="MI Logo" className="h-6 w-auto" />
            </div>}
          <button onClick={toggleSidebar} className="h-6 w-6 rounded-full bg-background flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("transform transition-transform", isExpanded ? "" : "rotate-180")}>
              <path d="M10.5 3.5L5.5 8L10.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 py-6">
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
              <Link to="/settings" className={cn("flex items-center rounded-lg px-3 py-2 text-sm transition-colors", isActive("/settings") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", !isExpanded && "justify-center")}>
                <Settings className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                {isExpanded && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          {isExpanded && <div className="rounded-lg bg-accent/50 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="h-5 w-5" />
                <h4 className="font-medium">Need Help?</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Check our documentation to get the most out of your CRM.
              </p>
              <a href="#" className="text-xs text-primary hover:underline">
                View Documentation →
              </a>
            </div>}
        </div>
      </div>
    </div>;
};
export default Sidebar;