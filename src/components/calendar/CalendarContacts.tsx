
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, Calendar, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CalendarContact {
  id: string;
  name: string;
  email: string;
  company?: string;
  avatarUrl?: string;
}

interface CalendarContactsProps {
  onContactAdded?: () => void;
}

const CalendarContacts: React.FC<CalendarContactsProps> = ({ onContactAdded }) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  // Sample data for contacts and deals
  const [contacts, setContacts] = useState<CalendarContact[]>([
    { id: "1", name: "John Smith", email: "john@example.com", company: "ABC Inc." },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com", company: "XYZ Corp" },
    { id: "3", name: "Michael Brown", email: "michael@example.com", company: "123 Industries" },
  ]);
  
  const deals = [
    { id: "deal1", name: "Software License Deal", company: "ABC Inc." },
    { id: "deal2", name: "Website Redesign Project", company: "XYZ Corp" },
    { id: "deal3", name: "Support Contract", company: "123 Industries" },
  ];

  const [recentContacts, setRecentContacts] = useState<CalendarContact[]>([
    { id: "1", name: "John Smith", email: "john@example.com", company: "ABC Inc." },
  ]);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToCalendar = () => {
    if (!selectedContact) {
      toast({
        title: "No Contact Selected",
        description: "Please select a contact to add to the calendar",
        variant: "destructive"
      });
      return;
    }
    
    const contact = contacts.find(c => c.id === selectedContact);
    
    if (contact && !recentContacts.some(c => c.id === contact.id)) {
      setRecentContacts(prev => [contact, ...prev]);
    }
    
    toast({
      title: "Contact Added to Calendar",
      description: `${contact?.name} has been added to your calendar contacts`,
    });
    
    setIsAddDialogOpen(false);
    setSelectedContact(null);
    setSelectedDeal(null);
    
    if (onContactAdded) {
      onContactAdded();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Calendar Contacts</CardTitle>
              <CardDescription>Manage contacts linked to your calendar</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1" /> Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={contact.avatarUrl} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <Calendar className="h-3 w-3 mr-1" />
                    Linked
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No contacts linked to your calendar</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-1" /> Add Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Calendar Contact</DialogTitle>
            <DialogDescription>
              Link a contact to your calendar to easily schedule events
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-search">Search Contacts</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contact-search"
                  placeholder="Search by name, email or company"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border rounded-md max-h-60 overflow-y-auto p-1">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className={`flex items-center p-2 rounded-sm mb-1 cursor-pointer ${
                      selectedContact === contact.id 
                        ? 'bg-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                    {selectedContact === contact.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No contacts found
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="associated-deal">Associated Deal (Optional)</Label>
              <Select value={selectedDeal || ""} onValueChange={setSelectedDeal}>
                <SelectTrigger id="associated-deal">
                  <SelectValue placeholder="Select a deal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {deals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.name} ({deal.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Linking a deal allows you to track meetings related to specific opportunities
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddToCalendar}
              disabled={!selectedContact}
            >
              Add to Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarContacts;
