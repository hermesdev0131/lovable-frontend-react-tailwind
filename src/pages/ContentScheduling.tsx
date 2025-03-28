import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash2, CheckCircle, XCircle, Plus, CalendarIcon, LinkIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SocialMediaPlatform, socialMediaService } from '@/services/socialMedia';

const PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "twitter", name: "Twitter", icon: Twitter },
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
];

const ContentScheduling = () => {
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    platforms: [] as string[],
    scheduledFor: new Date(),
    media: null as string | null,
    skipApproval: false,
  });
  
  const [contentList, setContentList] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  
  const { addContentItem, getContentItems, updateContentStatus, clients, currentClientId, isInMasterMode } = useMasterAccount();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [publishingStatus, setPublishingStatus] = useState<Record<number, { inProgress: boolean, result?: { success: boolean, message: string } }>>({});

  useEffect(() => {
    const items = getContentItems(currentClientId);
    setContentList(items);
  }, [currentClientId, getContentItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewContent({ ...newContent, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewContent({ ...newContent, scheduledFor: date });
      setIsDatePickerOpen(false);
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewContent({ ...newContent, media: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (platform: string) => {
    setNewContent(prev => {
      const platforms = [...prev.platforms];
      
      if (platforms.includes(platform)) {
        return { 
          ...prev, 
          platforms: platforms.filter(p => p !== platform) 
        };
      } else {
        return { 
          ...prev, 
          platforms: [...platforms, platform] 
        };
      }
    });
  };

  const getPlatformConnectionStatus = (platform: string): boolean => {
    return socialMediaService.isPlatformConnected(platform as SocialMediaPlatform);
  };

  const handleCreateContent = () => {
    if (!newContent.title || !newContent.content || newContent.platforms.length === 0 || !newContent.scheduledFor) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and select at least one platform",
        variant: "destructive"
      });
      return;
    }
    
    const disconnectedPlatforms = newContent.platforms.filter(
      platform => !getPlatformConnectionStatus(platform)
    );
    
    if (disconnectedPlatforms.length > 0) {
      toast({
        title: "Connection Required",
        description: `Please connect your ${disconnectedPlatforms.join(', ')} accounts before scheduling content.`,
        variant: "destructive"
      });
      return;
    }
    
    newContent.platforms.forEach(platform => {
      addContentItem({
        title: newContent.title,
        content: newContent.content,
        type: "social",
        platform: platform,
        createdBy: currentClientId || 0,
        scheduledFor: newContent.scheduledFor.toISOString(),
        media: newContent.media,
        clientId: currentClientId,
        skipApproval: newContent.skipApproval,
      });
    });
    
    setNewContent({ 
      title: "", 
      content: "", 
      platforms: [], 
      scheduledFor: new Date(), 
      media: null,
      skipApproval: false
    });
    setContentList(getContentItems(currentClientId));
    setIsCreateModalOpen(false);
    setSelectedFile(null);
    
    toast({
      title: "Content Scheduled",
      description: `${newContent.title} has been scheduled for ${newContent.platforms.length} platform${newContent.platforms.length > 1 ? 's' : ''}.`
    });
  };
  
  const handleApproveContent = (id: number) => {
    updateContentStatus(id, 'approved');
    setContentList(getContentItems(currentClientId));
    setSelectedContent(null);
    
    toast({
      title: "Content Approved",
      description: "The content has been approved for publishing."
    });
  };
  
  const handleRejectContent = (id: number) => {
    updateContentStatus(id, 'rejected', "Inappropriate content");
    setContentList(getContentItems(currentClientId));
    setSelectedContent(null);
    
    toast({
      title: "Content Rejected",
      description: "The content has been rejected and will not be published."
    });
  };
  
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  const renderPlatformIcon = (platform: string) => {
    const platformInfo = PLATFORMS.find(p => p.id.toLowerCase() === platform.toLowerCase());
    if (platformInfo) {
      const Icon = platformInfo.icon;
      return <Icon className="h-4 w-4 mr-2" />;
    }
    return null;
  };

  const handlePublishNow = async (contentItem: any) => {
    if (publishingStatus[contentItem.id]?.inProgress) return;
    
    setPublishingStatus(prev => ({
      ...prev,
      [contentItem.id]: { inProgress: true }
    }));
    
    try {
      const result = await socialMediaService.postToSocialMedia(
        contentItem.platform as SocialMediaPlatform,
        {
          content: contentItem.content,
          title: contentItem.title,
          mediaUrl: contentItem.media,
          scheduledFor: contentItem.scheduledFor ? new Date(contentItem.scheduledFor) : undefined
        }
      );
      
      setPublishingStatus(prev => ({
        ...prev,
        [contentItem.id]: { inProgress: false, result }
      }));
      
      if (result.success) {
        toast({
          title: "Content Published",
          description: `Successfully published to ${contentItem.platform}.`
        });
      } else {
        toast({
          title: "Publishing Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error publishing content:", error);
      setPublishingStatus(prev => ({
        ...prev,
        [contentItem.id]: { 
          inProgress: false, 
          result: { 
            success: false, 
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
          }
        }
      }));
      
      toast({
        title: "Publishing Failed",
        description: "An unexpected error occurred while publishing.",
        variant: "destructive"
      });
    }
  };

  const ContentForm = () => (
    <div className="grid gap-4 py-4">
      <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-4 items-center")}>
        <Label htmlFor="title" className={isMobile ? "" : "text-right"}>
          Title
        </Label>
        <Input 
          type="text" 
          id="title" 
          name="title" 
          placeholder="Enter content title"
          value={newContent.title} 
          onChange={handleInputChange} 
          className={isMobile ? "w-full" : "col-span-3"} 
        />
      </div>
      <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-4 items-center")}>
        <Label htmlFor="content" className={isMobile ? "" : "text-right"}>
          Content
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Enter content here"
          value={newContent.content}
          onChange={handleInputChange}
          className={isMobile ? "w-full min-h-[120px]" : "col-span-3"}
        />
      </div>
      <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-4 items-start")}>
        <Label className={isMobile ? "" : "text-right pt-2"}>
          Platforms
        </Label>
        <div className={isMobile ? "w-full" : "col-span-3 space-y-3"}>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`platform-${platform.id}`} 
                  checked={newContent.platforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
                <label
                  htmlFor={`platform-${platform.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  {React.createElement(platform.icon, { className: "h-4 w-4 mr-2" })}
                  {platform.name}
                </label>
              </div>
            ))}
          </div>
          {newContent.platforms.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Please select at least one platform.
            </p>
          )}
        </div>
      </div>
      <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-4 items-center")}>
        <Label htmlFor="scheduledFor" className={isMobile ? "" : "text-right"}>
          Schedule For
        </Label>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                isMobile ? "w-full" : "col-span-3 justify-start text-left",
                "font-normal flex items-center",
                !newContent.scheduledFor && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {newContent.scheduledFor ? (
                format(newContent.scheduledFor, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar
              mode="single"
              selected={newContent.scheduledFor}
              onSelect={handleDateChange}
              disabled={(date) =>
                date < new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-4 items-center")}>
        <Label htmlFor="media" className={isMobile ? "" : "text-right"}>
          Media
        </Label>
        <div className={isMobile ? "w-full" : "col-span-3"}>
          <Input
            type="file"
            id="media"
            name="media"
            onChange={handleFileSelect}
            className="w-full"
            accept="image/*"
          />
          {selectedFile && (
            <div className="mt-2">
              <p className="text-sm">Selected File: {selectedFile.name}</p>
              {newContent.media && (
                <div className="mt-2 max-w-xs mx-auto">
                  <img 
                    src={newContent.media} 
                    alt="Preview" 
                    className="max-h-32 object-contain rounded-md" 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isInMasterMode && (
        <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-4 items-center")}>
          <div className={isMobile ? "w-full" : "col-start-2 col-span-3 flex items-center space-x-2"}>
            <Checkbox
              id="skipApproval"
              checked={newContent.skipApproval}
              onCheckedChange={(checked) => 
                setNewContent({ ...newContent, skipApproval: !!checked })
              }
            />
            <label
              htmlFor="skipApproval"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Skip approval process (content will be automatically approved)
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const ContentCard = ({ content, index }: { content: any, index: number }) => (
    <Card key={content.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{content.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              {renderPlatformIcon(content.platform)}
              {content.platform}
              {!getPlatformConnectionStatus(content.platform) && (
                <Badge variant="outline" className="ml-2 text-xs">Not Connected</Badge>
              )}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {content.status === 'approved' && getPlatformConnectionStatus(content.platform) && (
                <DropdownMenuItem onClick={() => handlePublishNow(content)}>
                  <LinkIcon className="h-4 w-4 mr-2" /> Publish Now
                </DropdownMenuItem>
              )}
              <DropdownMenuItem disabled={content.status !== 'pending'} onClick={() => handleApproveContent(content.id)}>
                <CheckCircle className="h-4 w-4 mr-2" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem disabled={content.status !== 'pending'} onClick={() => handleRejectContent(content.id)}>
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Scheduled for:</span>
            <span className="font-medium">{format(new Date(content.scheduledFor || ''), "PPP")}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <div>
              {content.status === 'pending' && (
                <Badge variant="secondary">Pending</Badge>
              )}
              {content.status === 'approved' && (
                <Badge variant="default">Approved</Badge>
              )}
              {content.status === 'rejected' && (
                <Badge variant="destructive">Rejected</Badge>
              )}
            </div>
          </div>
          
          {isInMasterMode && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium">{getClientName(content.createdBy)}</span>
            </div>
          )}
          
          {publishingStatus[content.id]?.inProgress ? (
            <Badge className="mr-2">
              <RefreshCw className="h-3 w-3 animate-spin mr-1" /> Publishing...
            </Badge>
          ) : publishingStatus[content.id]?.result ? (
            <Badge 
              variant={publishingStatus[content.id].result?.success ? "default" : "destructive"}
              className="mr-2"
            >
              {publishingStatus[content.id].result?.success ? "Published" : "Failed"}
            </Badge>
          ) : null}
          
          {content.status === 'approved' && getPlatformConnectionStatus(content.platform) && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => handlePublishNow(content)}
              disabled={publishingStatus[content.id]?.inProgress}
            >
              {publishingStatus[content.id]?.inProgress ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" /> Publishing...
                </>
              ) : (
                <>
                  <LinkIcon className="h-3 w-3 mr-1" /> Publish Now
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-4 md:py-6 px-2 md:px-6 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">Content Scheduling</CardTitle>
              <CardDescription>Plan and schedule your social media content</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={() => window.location.href = '/social-media-integration'}
              >
                <LinkIcon className="h-4 w-4 mr-2" /> Connect Accounts
              </Button>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                {!isMobile ? (
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Schedule New Content
                    </Button>
                  </DialogTrigger>
                ) : (
                  <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> New Content
                  </Button>
                )}
                
                {!isMobile && (
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Schedule New Content</DialogTitle>
                      <DialogDescription>
                        Create and schedule new content for multiple social media platforms at once.
                      </DialogDescription>
                    </DialogHeader>
                    <ContentForm />
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        onClick={handleCreateContent}
                        disabled={newContent.platforms.length === 0}
                      >
                        Schedule Content {newContent.platforms.length > 0 && `(${newContent.platforms.length} platforms)`}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {contentList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No content scheduled yet</p>
                  <Button 
                    size="sm" 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Your First Post
                  </Button>
                </div>
              ) : (
                contentList.map((content, index) => (
                  <ContentCard key={content.id} content={content} index={index} />
                ))
              )}
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your scheduled content.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Schedule Date</TableHead>
                  <TableHead>Status</TableHead>
                  {isInMasterMode && <TableHead>Client</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isInMasterMode ? 6 : 5} className="text-center py-10">
                      <p className="text-muted-foreground">No content scheduled yet</p>
                      <Button 
                        size="sm" 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Create Your First Post
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  contentList.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">{content.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderPlatformIcon(content.platform)}
                          {content.platform}
                          {!getPlatformConnectionStatus(content.platform) && (
                            <Badge variant="outline" className="ml-1 text-xs">Not Connected</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(content.scheduledFor || ''), "PPP")}</TableCell>
                      <TableCell>
                        {content.status === 'pending' && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        {content.status === 'approved' && (
                          <Badge variant="default">Approved</Badge>
                        )}
                        {content.status === 'rejected' && (
                          <Badge variant="destructive">Rejected</Badge>
                        )}
                      </TableCell>
                      {isInMasterMode && <TableCell>{getClientName(content.createdBy)}</TableCell>}
                      <TableCell className="text-right">
                        {publishingStatus[content.id]?.inProgress ? (
                          <Badge className="mr-2">
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" /> Publishing...
                          </Badge>
                        ) : publishingStatus[content.id]?.result ? (
                          <Badge 
                            variant={publishingStatus[content.id].result?.success ? "default" : "destructive"}
                            className="mr-2"
                          >
                            {publishingStatus[content.id].result?.success ? "Published" : "Failed"}
                          </Badge>
                        ) : null}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {content.status === 'approved' && getPlatformConnectionStatus(content.platform) && (
                              <DropdownMenuItem 
                                onClick={() => handlePublishNow(content)}
                                disabled={publishingStatus[content.id]?.inProgress}
                              >
                                <LinkIcon className="h-4 w-4 mr-2" /> Publish Now
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem disabled={content.status !== 'pending'} onClick={() => handleApproveContent(content.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={content.status !== 'pending'} onClick={() => handleRejectContent(content.id)}>
                              <XCircle className="h-4 w-4 mr-2" /> Reject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isMobile && (
        <Drawer open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DrawerContent className="px-4 pb-6">
            <DrawerHeader>
              <DrawerTitle>Create New Content</DrawerTitle>
              <DrawerDescription>
                Schedule content for your social media platforms
              </DrawerDescription>
            </DrawerHeader>
            <ContentForm />
            <DrawerFooter className="pt-4">
              <Button 
                onClick={handleCreateContent}
                disabled={newContent.platforms.length === 0}
                className="w-full"
              >
                Schedule Content {newContent.platforms.length > 0 && `(${newContent.platforms.length} platforms)`}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default ContentScheduling;
