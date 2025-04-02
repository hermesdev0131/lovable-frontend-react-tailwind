
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useMasterAccount } from "@/contexts/MasterAccountContext";

interface SalesData {
  name: string;
  sales: number;
  leads: number;
  conversions: number;
}

interface ClientPerformanceTableProps {
  clientSalesData: SalesData[];
}

const ClientPerformanceTable = ({ clientSalesData }: ClientPerformanceTableProps) => {
  const { clients } = useMasterAccount();
  
  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Client Performance</CardTitle>
          <CardDescription>Sales and conversion metrics for all clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No clients have been added yet</p>
            <Button variant="outline" onClick={() => document.getElementById('settings-tab')?.click()}>
              <Building2 className="h-4 w-4 mr-2" />
              Add Your First Client
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Client Performance</CardTitle>
        <CardDescription>Sales and conversion metrics for all clients</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead>Conversions</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientSalesData.map((data, index) => {
              const client = clients[index];
              return (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{`${client.firstName} ${client.lastName}`}</TableCell>
                  <TableCell>${data.sales.toLocaleString()}</TableCell>
                  <TableCell>{data.leads}</TableCell>
                  <TableCell>{data.conversions}</TableCell>
                  <TableCell>{Math.round((data.conversions / data.leads) * 100)}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      client.leadType === 'Customer' 
                        ? 'bg-orange-900/20 text-orange-900 dark:bg-orange-800/30 dark:text-orange-200' 
                        : client.leadType === 'Prospect'
                        ? 'bg-amber-900/20 text-amber-900 dark:bg-amber-800/30 dark:text-amber-200'
                        : 'bg-yellow-900/20 text-yellow-900 dark:bg-yellow-800/30 dark:text-yellow-200'
                    }`}>
                      {client.leadType}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClientPerformanceTable;
