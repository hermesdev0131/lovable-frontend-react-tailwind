
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

const ClientsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const { clients } = useMasterAccount();
  
  // Collect all unique tags from clients
  const allTags = Array.from(
    new Set(clients.flatMap(client => client.tags || []))
  );
  
  // Map clients to format needed by the table
  const clientsWithTags = clients.map(client => ({
    id: client.id.toString(),
    name: `${client.firstName} ${client.lastName}`,
    email: client.emails && client.emails.length > 0 ? client.emails[0] : '',
    company: client.company || '',
    leadType: client.leadType || '',
    leadSource: client.leadSource || '',
    // Use client tags if available, otherwise empty array
    tags: client.tags || []
  }));
  
  // Filter clients based on search and tags
  const filteredClients = clientsWithTags.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => client.tags && client.tags.includes(tag));
      
    return matchesSearch && matchesTags;
  });
  
  // Sort clients alphabetically
  const sortedClients = [...filteredClients].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filter by tags:</span>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Lead Type</TableHead>
            <TableHead>Lead Source</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClients.length > 0 ? (
            sortedClients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>{client.leadType}</TableCell>
                <TableCell>{client.leadSource}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {client.tags && client.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No clients found. Try adjusting your search or filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
