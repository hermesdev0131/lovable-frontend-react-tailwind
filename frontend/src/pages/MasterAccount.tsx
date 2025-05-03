import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, LayoutDashboard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { toast } from "@/hooks/use-toast";
import ClientDirectory from '@/components/master-account/ClientDirectory';
import ClientPerformanceTable from '@/components/master-account/ClientPerformanceTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MasterAccount = () => {
  const navigate = useNavigate();
  const { clients, switchToClient } = useMasterAccount();
  
  const clientSalesData = clients.map(client => ({
    name: `${client.firstName} ${client.lastName}`,
    sales: Math.floor(Math.random() * 500000),
    leads: Math.floor(Math.random() * 500),
    conversions: Math.floor(Math.random() * 100)
  }));
  
  const handleClientClick = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      switchToClient(client.id);
      navigate('/');
      toast({
        title: `Switched to ${client.firstName} ${client.lastName}`,
        description: `You are now viewing ${client.firstName} ${client.lastName}'s account`,
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Master Account Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage clients and access client accounts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => navigate('/clients')}>
            <Users className="h-4 w-4 mr-2" /> Manage Clients
          </Button>
          <Button onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" /> Account Settings
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <LayoutDashboard className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="directory">Client Directory</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <ClientPerformanceTable clientSalesData={clientSalesData} />
        </TabsContent>
        <TabsContent value="directory">
          <ClientDirectory />
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>Quickly access client accounts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clients.map(client => (
            <Button 
              key={client.id} 
              variant="secondary" 
              className="flex flex-col items-start p-4 rounded-md shadow-sm hover:bg-secondary/80 transition-colors"
              onClick={() => handleClientClick(client.id)}
            >
              <Building2 className="h-5 w-5 mb-2 text-muted-foreground" />
              <div className="text-left">
                <h3 className="text-sm font-semibold">{client.firstName} {client.lastName}</h3>
                <p className="text-xs text-muted-foreground">{client.company}</p>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterAccount;
