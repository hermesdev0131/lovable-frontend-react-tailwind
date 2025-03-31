
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import ClientsTable from '@/components/clients/ClientsTable';
import { useToast } from '@/hooks/use-toast';

const Clients = () => {
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const { toast } = useToast();
  
  const handleCreateClientClick = () => {
    setShowAddClientForm(true);
  };
  
  const handleAddClient = () => {
    // Implement client creation logic here
    setShowAddClientForm(false);
    
    toast({
      title: "Client added",
      description: "The client has been successfully added.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={handleCreateClientClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      
      {showAddClientForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Client</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Client form would go here */}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddClientForm(false)}>Cancel</Button>
              <Button onClick={handleAddClient}>Add Client</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
