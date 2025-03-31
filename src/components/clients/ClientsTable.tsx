
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Sample data - would be replaced by actual client data
const sampleClients = [
  { id: '1', name: 'Acme Inc', email: 'contact@acmeinc.com', address: '123 Business Ave, Tech City', tags: ['enterprise', 'tech'] },
  { id: '2', name: 'Beta Corp', email: 'info@betacorp.com', address: '456 Market St, Commerce Town', tags: ['retail', 'small-business'] },
  { id: '3', name: 'Delta Dynamics', email: 'sales@deltadynamics.com', address: '789 Innovation Lane, Progress City', tags: ['manufacturing', 'enterprise'] },
  { id: '4', name: 'Creative Solutions', email: 'hello@creativesolutions.com', address: '1010 Design Blvd, Artville', tags: ['creative', 'small-business'] },
];

const ClientsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(sampleClients.flatMap(client => client.tags))
  );
  
  // Filter clients based on search and tags
  const filteredClients = sampleClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => client.tags.includes(tag));
      
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
      <div className="flex items-center justify-between">
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
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Filter by tags:</span>
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
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
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
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {client.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
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
