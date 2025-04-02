
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Phone } from "lucide-react";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Badge } from "@/components/ui/badge";

const ClientDirectory = () => {
  const { clients, removeClient } = useMasterAccount();
  
  const deleteClient = (id: number) => {
    removeClient(id);
  };
  
  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No clients have been added yet</p>
        <Button variant="outline" onClick={() => document.getElementById('firstName')?.focus()}>
          Add Your First Client
        </Button>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Lead Type</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.firstName} {client.lastName}</TableCell>
            <TableCell>
              <div className="space-y-1">
                {client.emails[0] && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-1 text-muted-foreground" /> 
                    {client.emails[0]}
                  </div>
                )}
                {client.phoneNumbers[0] && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
                    {client.phoneNumbers[0]}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>{client.company}</TableCell>
            <TableCell>{client.leadType}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {client.tags && client.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => deleteClient(client.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientDirectory;
