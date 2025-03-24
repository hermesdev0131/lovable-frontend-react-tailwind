
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Calendar, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { contacts, formatDate } from '@/lib/data';

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const company = contact.company.toLowerCase();
    const email = contact.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || company.includes(query) || email.includes(query);
  });

  // Extract initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Contact
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact, index) => (
            <Card key={contact.id} className="glass-card hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(contact.firstName, contact.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-medium">{contact.firstName} {contact.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{contact.position} at {contact.company}</p>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.birthday && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Born {formatDate(contact.birthday)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  Last contacted: {formatDate(contact.lastContact)}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredContacts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button>Add New Contact</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
