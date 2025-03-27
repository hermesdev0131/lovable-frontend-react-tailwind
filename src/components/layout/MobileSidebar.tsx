
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  Calendar as CalendarIcon, 
  Settings, 
  BookOpen, 
  HelpCircle, 
  Building2,
  Globe,
  Mail,
  Lightbulb,
  Star,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { useToast } from '@/hooks/use-toast';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const location = useLocation();
  const { isInMasterMode } = useMasterAccount();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="p-0 w-[270px] sm:max-w-sm border-r">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left">
              <img 
                src="/lovable-uploads/19d0bac1-2f20-4dcb-8a71-c65c4635deb8.png" 
                alt="Logo" 
                className="h-10 dark:invert"
              />
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="px-2 py-4">
            <div className="space-y-1">
              <Link
                to="/"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/clients"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/clients") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <Users className="h-5 w-5 mr-2" />
                <span>Clients</span>
              </Link>
              <Link
                to="/deals"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/deals") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <PieChart className="h-5 w-5 mr-2" />
                <span>Deals</span>
              </Link>
              <Link
                to="/opportunities"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/opportunities") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                <span>Opportunities</span>
              </Link>
              <Link
                to="/calendar"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/calendar") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Calendar</span>
              </Link>
              <Link
                to="/website"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/website") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <Globe className="h-5 w-5 mr-2" />
                <span>Website</span>
              </Link>
              <Link
                to="/email"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/email") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <Mail className="h-5 w-5 mr-2" />
                <span>Email</span>
              </Link>
              <Link
                to="/content"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/content") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                <span>Content</span>
              </Link>
              <Link
                to="/reputation"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/reputation") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <Star className="h-5 w-5 mr-2" />
                <span>Reputation</span>
              </Link>
              
              {isInMasterMode && (
                <Link
                  to="/master-account"
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive("/master-account") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                  )}
                  onClick={onClose}
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>Master Account</span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="px-2 py-2 mt-4 border-t">
            <div className="space-y-1 pt-2">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive("/settings") ? "bg-primary/20 text-primary" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={onClose}
              >
                <Settings className="h-5 w-5 mr-2" />
                <span>Settings</span>
              </Link>
              <Link
                to="#"
                onClick={() => {
                  onClose();
                  toast({
                    title: "Help",
                    description: "Redirecting to help documentation",
                  });
                  window.open('https://help.example.com', '_blank');
                }}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                )}
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                <span>Help</span>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
