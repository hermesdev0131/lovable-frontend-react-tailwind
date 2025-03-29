
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesData {
  name: string;
  sales: number;
  leads: number;
  conversions: number;
}

interface ClientSalesChartProps {
  clientSalesData: SalesData[];
}

const ClientSalesChart = ({ clientSalesData }: ClientSalesChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance by client</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={clientSalesData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Sales']} />
              <Legend />
              <Bar dataKey="sales" fill="#f97316" name="Sales ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSalesChart;
