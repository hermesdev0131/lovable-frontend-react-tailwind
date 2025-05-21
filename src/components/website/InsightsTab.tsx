
import React from 'react';
import { WebsitePage } from '@/types/website';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';

interface InsightsTabProps {
  websitePages: WebsitePage[];
}

const InsightsTab = ({ websitePages }: InsightsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Insights</CardTitle>
        <CardDescription>Performance metrics for your top pages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart className="h-16 w-16 mx-auto mb-4 text-primary/40" />
            <p>Detailed analytics visualization will appear here</p>
            <Button className="mt-4">
              Generate Report
            </Button>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Top Performing Pages</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Bounce Rate</TableHead>
                <TableHead>Avg. Time on Page</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websitePages
                .sort((a, b) => (b.views || b.visits || 0) - (a.views || a.visits || 0))
                .slice(0, 5)
                .map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>{(page.views || page.visits || 0).toLocaleString()}</TableCell>
                    <TableCell>{(page.conversions || 0).toLocaleString()}</TableCell>
                    <TableCell>{(page.bounceRate || 0).toFixed(1)}%</TableCell>
                    <TableCell>2m 34s</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsTab;
