
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, PieChart, TrendingUp, Users, DollarSign } from 'lucide-react';

const Reports = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">View and analyze your business data</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 w-full md:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Deals
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Custom
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Total sales and conversion rate</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Sales visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Deal Distribution</CardTitle>
                <CardDescription>By stage and value</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Deal distribution chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Month-over-month metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Performance trend data will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Summary of important business metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Connect your data sources to see KPIs here</p>
                <p className="mt-2 text-sm">Go to Settings → Integrations to add data connections</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle>Deal Analytics</CardTitle>
              <CardDescription>Detailed analysis of deal performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-24 text-muted-foreground">
                <p>Deal analytics dashboard will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Insights</CardTitle>
              <CardDescription>Analysis of contact engagement and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-24 text-muted-foreground">
                <p>Contact insights will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Build and save custom reports for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-24 text-muted-foreground">
                <p>Custom report builder will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
