
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesSummaryCardsProps {
  totalSales: number;
  averageSales: number;
  totalLeads: number;
  totalConversions: number;
}

const SalesSummaryCards = ({ totalSales, averageSales, totalLeads, totalConversions }: SalesSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Client Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all clients</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average Sales per Client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${Math.round(averageSales).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Monthly average</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads / Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLeads} / {totalConversions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((totalConversions / totalLeads) * 100)}% conversion rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesSummaryCards;
