import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  Calendar as CalendarIcon, 
  Settings, 
  Briefcase, 
  BookOpen, 
  Cable, 
  Star, 
  Send, 
  HelpCircle, 
  MessageCircle, 
  Bot,
  Building2 // Adding new icon for master account
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '../theme/ThemeProvider';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <aside className={cn(
      "bg-white border-r border-r-border sticky top-0 z-20 h-screen w-64 flex-col justify-between overflow-y-auto dark:bg-darker",
      !isExpanded && "w-16",
    )}>
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center space-x-2">
          <LayoutDashboard className="h-5 w-5" />
          {isExpanded && <span className="font-bold">CRM Pro</span>}
        </Link>
        <button
          className="ml-auto h-6 w-6 rounded-md border bg-secondary p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed data-[state=open]:bg-accent data-[state=open]:text-accent-foreground dark:border-secondary"
          onClick={onToggle}
        >
          {isExpanded ? "<" : ">"}
        </button>
        <ul className="mt-6 space-y-1">
          <li>
            <Link
              to="/"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <LayoutDashboard className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/contacts"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/contacts") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Users className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Contacts</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/pipeline"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/pipeline") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <PieChart className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Pipeline</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/opportunities"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/opportunities") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Briefcase className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Opportunities</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/calendar") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <CalendarIcon className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Calendar</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/integrations"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/integrations") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Cable className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Integrations</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/reputation"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/reputation") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Star className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Reputation</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/content-scheduling"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/content-scheduling") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Send className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Content</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/chatbot"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/chatbot") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Bot className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Chatbot</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/conversations"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/conversations") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <MessageCircle className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Conversations</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/master-account"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/master-account") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Building2 className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Master Account</span>}
            </Link>
          </li>
        </ul>
      </div>
      <div className="px-6 py-4">
        <ul className="mt-6 space-y-1">
          <li>
            <Link
              to="/settings"
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/settings") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <Settings className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Settings</span>}
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => {
                toast({
                  title: "Help",
                  description: "Redirecting to help documentation",
                });
                window.open('https://help.example.com', '_blank');
              }}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                !isExpanded && "justify-center",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <HelpCircle className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
              {isExpanded && <span>Help</span>}
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
