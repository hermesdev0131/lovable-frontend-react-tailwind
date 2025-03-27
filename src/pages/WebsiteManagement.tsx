import React, { useState } from 'react';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { BarChart, PieChart, LayoutGrid, Globe, Monitor, Smartphone, Tablet, Edit, Settings, LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface PageFormValues {
  title: string;
  url: string;
  status: 'published' | 'draft' | 'scheduled';
  type: 'landing' | 'blog' | 'product' | 'other';
}

const WebsiteManagement = () => {
  const { websitePages, addWebsitePage, removeWebsitePage, updateWebsitePage } = useMasterAccount();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  
  // Calculate page stats
  const totalPages = websitePages.length;
  const publishedPages = websitePages.filter(page => page.status === 'published').length;
  const totalViews = websitePages.reduce((sum, page) => sum + page.views, 0);
  const totalConversions = websitePages.reduce((sum, page) => sum + page.conversions, 0);
  const avgBounceRate = websitePages.length > 0 
    ? websitePages.reduce((sum, page) => sum + page.bounceRate, 0) / websitePages.length 
    : 0;
  
  // Landing pages specifically
  const landingPages = websitePages.filter(page => page.type === 'landing');
  const landingPageViews = landingPages.reduce((sum, page) => sum + page.views, 0);
  const landingPageConversions = landingPages.reduce((sum, page) => sum + page.conversions, 0);
  
  const addForm = useForm<PageFormValues>({
    defaultValues: {
      title: '',
      url: '',
      status: 'draft',
      type: 'landing'
    }
  });
  
  const editForm = useForm<PageFormValues>({
    defaultValues: {
      title: '',
      url: '',
      status: 'published',
      type: 'landing'
    }
  });
  
  const handleAddPage = (data: PageFormValues) => {
    const newPage = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      conversions: 0,
      bounceRate: 0,
      title: newPage.title,
      url: newPage.url,
      status: newPage.status as 'published' | 'draft' | 'scheduled',
      type: newPage.type as 'landing' | 'blog' | 'product' | 'other',
      clientId: currentClientId,
    };
    
    addWebsitePage(newPage);
    addForm.reset();
    setIsAddDialogOpen(false);
  };
  
  const openEditDialog = (pageId: number) => {
    const page = websitePages.find(p => p.id === pageId);
    if (page) {
      editForm.reset({
        title: page.title,
        url: page.url,
        status: page.status,
        type: page.type
      });
      setEditingPageId(pageId);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleEditPage = (data: PageFormValues) => {
    if (editingPageId) {
      updateWebsitePage(editingPageId, data);
      setIsEditDialogOpen(false);
      setEditingPageId(null);
    }
  };
  
  const deletePage = (pageId: number) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      removeWebsitePage(pageId);
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'secondary';
      case 'scheduled':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Website & Landing Pages</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Page</DialogTitle>
              <DialogDescription>
                Create a new page for your website.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddPage)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter page title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Path</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">https://yoursite.com</span>
                          <Input placeholder="/path" {...field} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="landing">Landing Page</SelectItem>
                            <SelectItem value="blog">Blog</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Create Page</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
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
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Pages</TabsTrigger>
          <TabsTrigger value="landing">Landing Pages</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="devices">Device Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="landing" className="mt-4">
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
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
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
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">{page.title}</TableCell>
                          <TableCell>{page.views.toLocaleString()}</TableCell>
                          <TableCell>{page.conversions.toLocaleString()}</TableCell>
                          <TableCell>{page.bounceRate.toFixed(1)}%</TableCell>
                          <TableCell>2m 34s</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>How users access your website across different devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Monitor className="h-4 w-4 mr-2" />
                      Desktop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">58%</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(totalViews * 0.58).toLocaleString()} views
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">36%</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(totalViews * 0.36).toLocaleString()} views
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Tablet className="h-4 w-4 mr-2" />
                      Tablet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">6%</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(totalViews * 0.06).toLocaleString()} views
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <PieChart className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                  <p>Device distribution visualization will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Update the details for this page.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditPage)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Path</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">https://yoursite.com</span>
                        <Input {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="landing">Landing Page</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteManagement;
