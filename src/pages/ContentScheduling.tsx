
import React, { useState, useEffect } from 'react';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CalendarIcon, 
  Plus, 
  Calendar as CalendarIcon2,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  FileText,
  Check,
  MoreHorizontal,
  Edit2,
  Trash2
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ContentItem } from '@/contexts/MasterAccountContext';

const ContentScheduling = () => {
  const { addContentItem, getContentItems, updateContentStatus, currentClientId } = useMasterAccount();
  const { toast } = useToast();
  
  // State for all content
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState('calendar');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // New content item state
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    type: 'post',
    status: 'draft',
    scheduledFor: new Date()
  });
  
  useEffect(() => {
    const items = getContentItems(currentClientId);
    setContentItems(items);
  }, [currentClientId, getContentItems]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewContent({
      ...newContent,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewContent({
      ...newContent,
      [name]: value
    });
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewContent({
        ...newContent,
        scheduledFor: date
      });
    }
  };
  
  const handleAddContent = () => {
    if (!newContent.title || !newContent.content) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    addContentItem({
      title: newContent.title,
      content: newContent.content,
      type: newContent.type as 'post' | 'email' | 'blog' | 'social',
      status: newContent.status as 'draft' | 'scheduled' | 'published',
      scheduledFor: newContent.scheduledFor.toISOString(),
      createdBy: currentClientId || '0', // Using string instead of number
      clientId: currentClientId
    });
    
    setNewContent({
      title: '',
      content: '',
      type: 'post',
      status: 'draft',
      scheduledFor: new Date()
    });
    
    setIsAddDialogOpen(false);
    
    // Refresh content items
    const updatedItems = getContentItems(currentClientId);
    setContentItems(updatedItems);
    
    toast({
      title: "Content Added",
      description: "Your content has been added to the schedule"
    });
  };
  
  const handlePublish = (itemId: number) => {
    updateContentStatus(itemId, 'published');
    
    // Refresh content items
    const updatedItems = getContentItems(currentClientId);
    setContentItems(updatedItems);
    
    toast({
      title: "Content Published",
      description: "The content has been published successfully"
    });
  };
  
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'social':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'blog':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-amber-500">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };
  
  // Filter content for the calendar view based on selected date
  const getContentForDate = (date: Date) => {
    return contentItems.filter(item => {
      if (!item.scheduledFor) return false;
      
      const itemDate = parseISO(item.scheduledFor);
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Get upcoming content (next 7 days)
  const getUpcomingContent = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return contentItems
      .filter(item => {
        if (!item.scheduledFor) return false;
        
        const itemDate = parseISO(item.scheduledFor);
        return isBefore(itemDate, nextWeek) && isAfter(itemDate, today);
      })
      .sort((a, b) => {
        const dateA = parseISO(a.scheduledFor || '');
        const dateB = parseISO(b.scheduledFor || '');
        return dateA.getTime() - dateB.getTime();
      });
  };
  
  // Get today's content
  const getTodayContent = () => {
    return contentItems.filter(item => {
      if (!item.scheduledFor) return false;
      
      const itemDate = parseISO(item.scheduledFor);
      return isToday(itemDate);
    });
  };
  
  // Format date for display
  const formatScheduleDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not scheduled';
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  };
  
  // Check if a date has content
  const dayHasContent = (date: Date) => {
    return contentItems.some(item => {
      if (!item.scheduledFor) return false;
      
      const itemDate = parseISO(item.scheduledFor);
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Scheduling</h1>
          <p className="text-muted-foreground">Manage and schedule your content</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon2 className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">
            <FileText className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="today">
            <Check className="mr-2 h-4 w-4" />
            Today's Content
          </TabsTrigger>
        </TabsList>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>View and manage your scheduled content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasContent: (date) => dayHasContent(date)
                    }}
                    modifiersStyles={{
                      hasContent: {
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)'
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                  </h3>
                  
                  {selectedDate && getContentForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No content scheduled for this date</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Content
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDate && getContentForDate(selectedDate).map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                {getContentIcon(item.type)}
                                <CardTitle className="text-base">{item.title}</CardTitle>
                              </div>
                              {getStatusBadge(item.status || 'draft')}
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {formatScheduleDate(item.scheduledFor)}
                            </div>
                          </CardContent>
                          <CardFooter className="p-2 bg-muted/50 flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handlePublish(item.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Publish Now
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* List Tab */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Content</CardTitle>
                  <CardDescription>Content scheduled for the next 7 days</CardDescription>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {getUpcomingContent().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming content scheduled</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUpcomingContent().map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            {getContentIcon(item.type)}
                            <CardTitle className="text-base">{item.title}</CardTitle>
                          </div>
                          {getStatusBadge(item.status || 'draft')}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {formatScheduleDate(item.scheduledFor)}
                        </div>
                      </CardContent>
                      <CardFooter className="p-2 bg-muted/50 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePublish(item.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Publish Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Today's Content Tab */}
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Content</CardTitle>
                  <CardDescription>Content scheduled for today</CardDescription>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {getTodayContent().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No content scheduled for today</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getTodayContent().map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            {getContentIcon(item.type)}
                            <CardTitle className="text-base">{item.title}</CardTitle>
                          </div>
                          {getStatusBadge(item.status || 'draft')}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {formatScheduleDate(item.scheduledFor)}
                        </div>
                      </CardContent>
                      <CardFooter className="p-2 bg-muted/50 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePublish(item.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Publish Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Content Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
            <DialogDescription>
              Create and schedule new content for your channels
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={newContent.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                name="content"
                value={newContent.content}
                onChange={handleInputChange}
                className="col-span-3 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <Select
                onValueChange={(value) => handleSelectChange('type', value)}
                defaultValue={newContent.type}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Blog Post</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select
                onValueChange={(value) => handleSelectChange('status', value)}
                defaultValue={newContent.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Schedule For</Label>
              <div className="col-span-3">
                <div className="flex items-center">
                  <Calendar
                    mode="single"
                    selected={newContent.scheduledFor}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddContent}>
              Add Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentScheduling;
