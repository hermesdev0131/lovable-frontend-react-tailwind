
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, Globe, BarChart, PieChart } from 'lucide-react';

interface WebsiteStatsProps {
  totalPages: number;
  publishedPages: number;
  totalViews: number;
  totalConversions: number;
  avgBounceRate: number;
}

const WebsiteStats = ({
  totalPages,
  publishedPages,
  totalViews,
  totalConversions,
  avgBounceRate
}: WebsiteStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{totalPages}</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">{publishedPages} published</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Globe className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">Across all pages</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{totalConversions.toLocaleString()}</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">
              {totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}% conversion rate
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Bounce Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{avgBounceRate.toFixed(1)}%</div>
            <div className="p-2 bg-primary/10 rounded-full">
              <PieChart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <span className={avgBounceRate < 40 ? "text-green-500 font-medium" : "text-amber-500 font-medium"}>
              {avgBounceRate < 40 ? "Good" : "Needs improvement"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteStats;
