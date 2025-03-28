
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMasterAccount } from "@/contexts/MasterAccountContext";

const ClientDirectory = () => {
  const { clients, removeClient } = useMasterAccount();
  
  const deleteClient = (id: number) => {
    removeClient(id);
  };
  
  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No clients have been added yet</p>
        <Button variant="outline" onClick={() => document.getElementById('name')?.focus()}>
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
          <TableHead>Email</TableHead>
          <TableHead>Subscription</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.subscription}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
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
