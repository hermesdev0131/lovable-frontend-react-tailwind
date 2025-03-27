
import React from 'react';
import { WebsitePage } from '@/types/website';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Settings, Activity, LinkIcon } from 'lucide-react';

interface AllPagesTabProps {
  websitePages: WebsitePage[];
  openEditDialog: (pageId: number) => void;
  deletePage: (pageId: number) => void;
  startTracking: (pageId: number) => void;
  formatDate: (dateString: string) => string;
  getStatusBadgeVariant: (status: string) => string;
}

const AllPagesTab = ({
  websitePages,
  openEditDialog,
  deletePage,
  startTracking,
  formatDate,
  getStatusBadgeVariant
}: AllPagesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Website Pages</CardTitle>
        <CardDescription>Manage all your website pages from one place</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websitePages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-1 text-gray-500" />
                    {page.url}
                  </div>
                </TableCell>
                <TableCell>{page.type.charAt(0).toUpperCase() + page.type.slice(1)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(page.status) as any}>
                    {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(page.updatedAt)}</TableCell>
                <TableCell>{page.views.toLocaleString()}</TableCell>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startTracking(page.id)}
                      className="ml-2"
                    >
                      <Activity className="h-3 w-3 mr-1" /> Track
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

export default AllPagesTab;
