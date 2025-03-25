import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  PieChart,
  LineChart,
  Layers,
  Settings,
  Menu,
  X,
  Zap,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link 
        to={to} 
        className={cn(
          "flex h-10 items-center rounded-md text-sm transition-all w-full",
          "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-foreground/60 hover:text-foreground"
        )}
      >
        <div className={cn("flex items-center px-3 w-full", !label && "justify-center")}>
          <div className="shrink-0 w-5 h-5 flex justify-center items-center">{icon}</div>
          {label && <span className="ml-3 truncate">{label}</span>}
        </div>
      </Link>
    </TooltipTrigger>
    <TooltipContent side="right" className="hidden lg:block">
      {label}
    </TooltipContent>
  </Tooltip>
);

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
    localStorage.setItem('sidebar-expanded', String(!expanded));
  };

  const navItems = [
    { to: '/', icon: <PieChart className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/contacts', icon: <Users className="h-5 w-5" />, label: 'Contacts' },
    { to: '/pipeline', icon: <LineChart className="h-5 w-5" />, label: 'Pipeline' },
    { to: '/opportunities', icon: <Layers className="h-5 w-5" />, label: 'Opportunities' },
    { to: '/calendar', icon: <Calendar className="h-5 w-5" />, label: 'Calendar' },
    { to: '/integrations', icon: <Zap className="h-5 w-5" />, label: 'Integrations' },
    { to: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r border-border",
        "bg-sidebar transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className={cn("flex items-center space-x-2", expanded ? "opacity-100" : "opacity-0 hidden")}>
          <div className="rounded-full bg-primary/10 p-1">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CRM Pro</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex flex-col space-y-1 p-3">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={expanded ? item.label : ''}
            isActive={location.pathname === item.to}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
