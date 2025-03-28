
import React from 'react';
import { WebsitePage } from '@/types/website';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Settings } from 'lucide-react';

interface LandingPagesTabProps {
  landingPages: WebsitePage[];
  landingPageViews: number;
  landingPageConversions: number;
  openEditDialog: (pageId: number) => void;
  deletePage: (pageId: number) => void;
  getStatusBadgeVariant: (status: string) => string;
}

const LandingPagesTab = ({
  landingPages,
  landingPageViews,
  landingPageConversions,
  openEditDialog,
  deletePage,
  getStatusBadgeVariant
}: LandingPagesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Landing Pages</CardTitle>
        <CardDescription>Manage your landing pages and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Landing Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{landingPageViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                {landingPages.length} landing pages
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Landing Page Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{landingPageConversions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                {landingPageViews > 0 ? ((landingPageConversions / landingPageViews) * 100).toFixed(1) : 0}% conversion rate
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Conversions</TableHead>
              <TableHead>Conv. Rate</TableHead>
              <TableHead>Bounce Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {landingPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(page.status) as any}>
                    {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{page.views.toLocaleString()}</TableCell>
                <TableCell>{page.conversions.toLocaleString()}</TableCell>
                <TableCell>
                  {page.views > 0 ? ((page.conversions / page.views) * 100).toFixed(1) : 0}%
                </TableCell>
                <TableCell>{page.bounceRate.toFixed(1)}%</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditDialog(page.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deletePage(page.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LandingPagesTab;
