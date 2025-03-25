
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Calendar, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { contacts, formatDate } from '@/lib/data';

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupByTags, setGroupByTags] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const company = contact.company.toLowerCase();
    const email = contact.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || company.includes(query) || email.includes(query);
  });

  // Extract all unique tags from contacts
  const allTags = Array.from(
    new Set(
      filteredContacts.flatMap(contact => contact.tags)
    )
  ).sort();

  // Group contacts by tags if groupByTags is true
  const groupedContacts: Record<string, typeof contacts> = {};
  
  if (groupByTags) {
    // Initialize with "No Tags" group
    groupedContacts["No Tags"] = [];
    
    // Add each tag as a group
    allTags.forEach(tag => {
      groupedContacts[tag] = [];
    });
    
    // Distribute contacts to their respective tag groups
    filteredContacts.forEach(contact => {
      if (contact.tags.length === 0) {
        groupedContacts["No Tags"].push(contact);
      } else {
        contact.tags.forEach(tag => {
          if (!groupedContacts[tag]) {
            groupedContacts[tag] = [];
          }
          groupedContacts[tag].push(contact);
        });
      }
    });
    
    // Remove empty groups
    Object.keys(groupedContacts).forEach(tag => {
      if (groupedContacts[tag].length === 0) {
        delete groupedContacts[tag];
      }
    });
  }

  // Toggle expansion of a group
  const toggleGroupExpansion = (tag: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }));
  };

  // Extract initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Render a contact card
  const renderContactCard = (contact: typeof contacts[0], index: number) => (
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
  );

  // Render contact cards in a grid
  const renderContactGrid = (contactsToRender: typeof contacts) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contactsToRender.map((contact, index) => 
        renderContactCard(contact, index)
      )}
    </div>
  );

  // Render contacts in a table
  const renderContactTable = (contactsToRender: typeof contacts) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactsToRender.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
              <TableCell>{contact.company}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{formatDate(contact.lastContact)}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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
          <div className="flex flex-wrap gap-2">
            <Select value={viewMode} onValueChange={(value: 'card' | 'table') => setViewMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card View</SelectItem>
                <SelectItem value="table">Table View</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="groupByTags" 
                checked={groupByTags}
                onCheckedChange={(checked) => {
                  setGroupByTags(checked === true);
                  // If enabling grouping, expand all groups by default
                  if (checked === true) {
                    const expandAll: Record<string, boolean> = {};
                    allTags.forEach(tag => {
                      expandAll[tag] = true;
                    });
                    expandAll["No Tags"] = true;
                    setExpandedGroups(expandAll);
                  }
                }}
              />
              <label
                htmlFor="groupByTags"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Group by Tags
              </label>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Contact
            </Button>
          </div>
        </div>
        
        {groupByTags ? (
          Object.keys(groupedContacts).map(tag => (
            <div key={tag} className="mb-8">
              <Button
                variant="ghost"
                className="mb-4 font-semibold text-base flex items-center justify-start p-2 w-full"
                onClick={() => toggleGroupExpansion(tag)}
              >
                {expandedGroups[tag] ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                {tag} ({groupedContacts[tag].length})
              </Button>
              
              {expandedGroups[tag] && (
                viewMode === 'card' 
                  ? renderContactGrid(groupedContacts[tag])
                  : renderContactTable(groupedContacts[tag])
              )}
            </div>
          ))
        ) : (
          <>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No contacts found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button>Add New Contact</Button>
              </div>
            ) : (
              viewMode === 'card' 
                ? renderContactGrid(filteredContacts)
                : renderContactTable(filteredContacts)
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contacts;
