import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Building2, Settings, BarChart3, AlertTriangle } from "lucide-react";
import SalesSummaryCards from "@/components/master-account/SalesSummaryCards";
import ClientSalesChart from "@/components/master-account/ClientSalesChart";
import ClientPerformanceTable from "@/components/master-account/ClientPerformanceTable";
import AddClientForm from "@/components/master-account/AddClientForm";
import ClientDirectory from "@/components/master-account/ClientDirectory";
import { logError } from "@/lib/errorHandling";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MasterAccount = () => {
  const { clients } = useMasterAccount();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(errorMessage);
        logError(err, "Error loading master account dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const clientSalesData = clients.map(client => ({
    name: client.name,
    sales: Math.floor(Math.random() * 10000) + 2000,
    leads: Math.floor(Math.random() * 50) + 10,
    conversions: Math.floor(Math.random() * 30) + 5,
  }));
  
  const totalSales = clientSalesData.reduce((sum, client) => sum + client.sales, 0);
  const averageSales = clients.length > 0 ? totalSales / clients.length : 0;
  const totalLeads = clientSalesData.reduce((sum, client) => sum + client.leads, 0);
  const totalConversions = clientSalesData.reduce((sum, client) => sum + client.conversions, 0);
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Master Account Dashboard</h1>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4 flex justify-start">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Client Sales Dashboard
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <SalesSummaryCards 
            totalSales={totalSales} 
            averageSales={averageSales} 
            totalLeads={totalLeads} 
            totalConversions={totalConversions} 
          />
          
          <ClientSalesChart clientSalesData={clientSalesData} />
          
          <ClientPerformanceTable clientSalesData={clientSalesData} />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6" id="settings-tab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" /> Add New Client
              </CardTitle>
              <CardDescription>Create a new client account in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <AddClientForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>View and manage all client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientDirectory />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Master Account Settings</CardTitle>
              <CardDescription>Configure your master account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings options will appear here in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterAccount;
