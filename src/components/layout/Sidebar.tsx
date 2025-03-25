
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
  Building2,
  Globe,
  ChevronLeft,
  ChevronRight,
  Mail
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '../theme/ThemeProvider';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isInMasterMode } = useMasterAccount();
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
    <div className="relative flex">
      <aside className={cn(
        "bg-background text-foreground sticky top-0 z-20 h-screen flex-col justify-between overflow-y-auto transition-all duration-300",
        isExpanded ? "w-64" : "w-16",
      )}>
        <div className="flex flex-col h-full">
          <div className={cn(
            "w-full flex flex-col items-center bg-background/80 mb-4",
            isExpanded ? "pb-4" : "pb-2"
          )}>
            <div className="w-full flex flex-col items-center">
              <div className={cn(
                "flex items-center justify-center w-full px-2",
                isExpanded ? "py-3" : "py-2"
              )}>
                <img 
                  src="/lovable-uploads/19d0bac1-2f20-4dcb-8a71-c65c4635deb8.png" 
                  alt="M Logo" 
                  className={cn(
                    "dark:invert w-full max-w-full object-contain", 
                    isExpanded ? "h-14" : "h-10"
                  )}
                />
              </div>
            </div>
          </div>
          
          <div className="px-4 flex-1">
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive("/") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    isActive("/contacts") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    isActive("/pipeline") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    isActive("/opportunities") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    isActive("/calendar") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                    !isExpanded && "justify-center"
                  )}
                >
                  <CalendarIcon className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                  {isExpanded && <span>Calendar</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/website-management"
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive("/website-management") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                    !isExpanded && "justify-center"
                  )}
                >
                  <Globe className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                  {isExpanded && <span>Website</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/email-marketing"
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive("/email-marketing") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                    !isExpanded && "justify-center"
                  )}
                >
                  <Mail className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                  {isExpanded && <span>Email</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/reputation"
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive("/reputation") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    isActive("/content-scheduling") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    isActive("/chatbot") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    isActive("/conversations") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                    !isExpanded && "justify-center"
                  )}
                >
                  <MessageCircle className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                  {isExpanded && <span>Conversations</span>}
                </Link>
              </li>
              
              {isInMasterMode && (
                <li>
                  <Link
                    to="/master-account"
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive("/master-account") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                      !isExpanded && "justify-center"
                    )}
                  >
                    <Building2 className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                    {isExpanded && <span>Master Account</span>}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          <div className="px-4 py-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive("/settings") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
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
                    "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <HelpCircle className={cn("h-5 w-5", isExpanded ? "mr-2" : "")} />
                  {isExpanded && <span>Help</span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      
      <button
        className={cn(
          "absolute h-8 w-8 top-4 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 z-30",
          isExpanded ? "left-60" : "left-12"
        )}
        onClick={onToggle}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default Sidebar;
