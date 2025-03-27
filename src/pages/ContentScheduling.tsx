
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Edit, Trash2, CheckCircle, XCircle, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ContentScheduling = () => {
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    platform: "Facebook",
    scheduledFor: new Date(),
    media: null as string | null,
  });
  
  const [contentList, setContentList] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { addContentItem, getContentItems, updateContentStatus, clients, currentClientId, isInMasterMode } = useMasterAccount();
  const { toast } = useToast();

  useEffect(() => {
    const items = getContentItems(currentClientId);
    setContentList(items);
  }, [currentClientId, getContentItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewContent({ ...newContent, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setNewContent({ ...newContent, platform: value });
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

  const handleCreateContent = () => {
    if (!newContent.title || !newContent.content || !newContent.platform || !newContent.scheduledFor) {
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
      type: "social",
      platform: newContent.platform,
      createdBy: currentClientId || 0,
      scheduledFor: newContent.scheduledFor.toISOString(),
      media: newContent.media,
      clientId: currentClientId,
    });
    
    setNewContent({ title: "", content: "", platform: "Facebook", scheduledFor: new Date(), media: null });
    setContentList(getContentItems(currentClientId));
    setIsCreateModalOpen(false);
    toast({
      title: "Content Scheduled",
      description: `${newContent.title} has been scheduled successfully.`
    });
  };
  
  const handleApproveContent = (id: number) => {
    updateContentStatus(id, 'approved');
    setContentList(getContentItems(currentClientId));
  };
  
  const handleRejectContent = (id: number) => {
    updateContentStatus(id, 'rejected', "Inappropriate content");
    setContentList(getContentItems(currentClientId));
  };
  
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Scheduling</CardTitle>
          <CardDescription>Plan and schedule your social media content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>Schedule New Content</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Content</DialogTitle>
                  <DialogDescription>
                    Create and schedule a new piece of content for your social media platforms.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input 
                      type="text" 
                      id="title" 
                      name="title" 
                      placeholder="Enter content title"
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
                      placeholder="Enter content here"
                      value={newContent.content}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="platform" className="text-right">
                      Platform
                    </Label>
                    <Select onValueChange={handleSelectChange} defaultValue={newContent.platform}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scheduledFor" className="text-right">
                      Schedule For
                    </Label>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !newContent.scheduledFor && "text-muted-foreground"
                          )}
                        >
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="media" className="text-right">
                      Media
                    </Label>
                    <Input
                      type="file"
                      id="media"
                      name="media"
                      onChange={handleFileSelect}
                      className="col-span-3"
                    />
                    {selectedFile && (
                      <div className="col-span-4 mt-2">
                        <p>Selected File: {selectedFile.name}</p>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateContent}>Schedule Content</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
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
              {contentList.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell>{content.platform}</TableCell>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentScheduling;
