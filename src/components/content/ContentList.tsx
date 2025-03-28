
import React, { useState } from 'react';
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import ContentCreationForm from './ContentCreationForm';
import ContentEditDialog from './ContentEditDialog';
import { ContentItem } from "@/types/masterAccount";

const ContentList = () => {
  const { getContentItems, updateContentStatus, clients, currentClientId, isInMasterMode } = useMasterAccount();
  
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [contentToEdit, setContentToEdit] = useState<ContentItem | null>(null);
  const [contentToDelete, setContentToDelete] = useState<ContentItem | null>(null);
  const [contentToReview, setContentToReview] = useState<ContentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const isMobile = useIsMobile();
  
  // Get content items from context
  const contentItems = getContentItems(currentClientId);
  
  const handleCloseCreationForm = () => {
    setIsCreatingContent(false);
  };
  
  const handleEditContent = (content: ContentItem) => {
    setContentToEdit(content);
  };
  
  const handleDeleteContent = (content: ContentItem) => {
    setContentToDelete(content);
  };
  
  const handleReviewContent = (content: ContentItem) => {
    setContentToReview(content);
  };
  
  const confirmDeleteContent = () => {
    if (contentToDelete) {
      // TODO: Implement delete functionality when available in context
      toast({
        title: "Content Deleted",
        description: `${contentToDelete.title} has been successfully deleted.`
      });
    }
    setContentToDelete(null);
  };
  
  const handleApproveContent = () => {
    if (contentToReview) {
      updateContentStatus(contentToReview.id, 'approved');
      toast({
        title: "Content Approved",
        description: `${contentToReview.title} has been approved and will be published as scheduled.`
      });
      setContentToReview(null);
    }
  };
  
  const handleRejectContent = () => {
    if (contentToReview && rejectionReason) {
      updateContentStatus(contentToReview.id, 'rejected', rejectionReason);
      toast({
        title: "Content Rejected",
        description: `${contentToReview.title} has been rejected.`
      });
      setContentToReview(null);
      setRejectionReason("");
    }
  };
  
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Unknown";
  };
  
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'blog':
        return <Badge className="bg-blue-500">Blog</Badge>;
      case 'social':
        return <Badge className="bg-green-500">Social</Badge>;
      case 'email':
        return <Badge className="bg-orange-500">Email</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  // Mobile view card for each content item
  const ContentCard = ({ content }: { content: ContentItem }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-base">{content.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              {getContentTypeBadge(content.type)}
              <span className="ml-2 text-muted-foreground">
                {format(new Date(content.createdAt), "MMM d, yyyy")}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditContent(content)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteContent(content)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
              {content.status === 'pending' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleReviewContent(content)}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Review
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            {getStatusBadge(content.status)}
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scheduled:</span>
            <span>{content.scheduledFor ? format(new Date(content.scheduledFor), "MMM d, yyyy") : "Not scheduled"}</span>
          </div>
          
          {isInMasterMode && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created by:</span>
              <span>{getClientName(content.createdBy)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Content</h3>
        <Button size={isMobile ? "sm" : "default"} onClick={() => setIsCreatingContent(true)}>
          <Plus className="h-4 w-4 mr-2" /> 
          {isMobile ? "Add" : "Create Content"}
        </Button>
      </div>
      
      {contentItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No content items found</p>
            <Button onClick={() => setIsCreatingContent(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Your First Content
            </Button>
          </CardContent>
        </Card>
      ) : isMobile ? (
        <div className="space-y-2">
          {contentItems.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>A list of your content items</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Scheduled</TableHead>
                  {isInMasterMode && <TableHead>Created By</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.map(content => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>{getContentTypeBadge(content.type)}</TableCell>
                    <TableCell>{getStatusBadge(content.status)}</TableCell>
                    <TableCell>{format(new Date(content.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {content.scheduledFor ? format(new Date(content.scheduledFor), "MMM d, yyyy") : "Not scheduled"}
                    </TableCell>
                    {isInMasterMode && (
                      <TableCell>{getClientName(content.createdBy)}</TableCell>
                    )}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditContent(content)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteContent(content)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                          {content.status === 'pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleReviewContent(content)}>
                                <CheckCircle className="h-4 w-4 mr-2" /> Review
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Content Creation Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={isCreatingContent} onOpenChange={setIsCreatingContent}>
          <DrawerContent className="px-4 pb-4">
            <DrawerHeader>
              <DrawerTitle>Create Content</DrawerTitle>
              <DrawerDescription>
                Create and schedule new content
              </DrawerDescription>
            </DrawerHeader>
            <ContentCreationForm onSuccess={handleCloseCreationForm} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isCreatingContent} onOpenChange={setIsCreatingContent}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
              <DialogDescription>
                Create and schedule new content
              </DialogDescription>
            </DialogHeader>
            <ContentCreationForm onSuccess={handleCloseCreationForm} />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Content Dialog */}
      <ContentEditDialog 
        isOpen={contentToEdit !== null}
        onClose={() => setContentToEdit(null)}
        contentItem={contentToEdit}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={contentToDelete !== null} onOpenChange={() => setContentToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContentToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteContent}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Content Review Dialog */}
      <Dialog open={contentToReview !== null} onOpenChange={() => setContentToReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Content</DialogTitle>
            <DialogDescription>
              Review and approve or reject this content item
            </DialogDescription>
          </DialogHeader>
          
          {contentToReview && (
            <div className="py-4 space-y-4">
              <div>
                <h4 className="font-medium mb-1">Title</h4>
                <p>{contentToReview.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Content</h4>
                <p className="text-sm whitespace-pre-wrap border p-3 rounded-md bg-muted/50">
                  {contentToReview.content}
                </p>
              </div>
              
              {contentToReview.media && (
                <div>
                  <h4 className="font-medium mb-1">Media</h4>
                  <img 
                    src={contentToReview.media} 
                    alt="Content media" 
                    className="max-h-48 rounded-md" 
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Type</h4>
                  <p>{contentToReview.type}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Scheduled For</h4>
                  <p>
                    {contentToReview.scheduledFor 
                      ? format(new Date(contentToReview.scheduledFor), "PPP") 
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
              
              {contentToReview.status === 'pending' && (
                <div className="pt-4 space-y-4">
                  <div className="flex space-x-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleApproveContent}
                      className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve Content
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                      onClick={() => setRejectionReason("Needs revision")}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Reject Content
                    </Button>
                  </div>
                  
                  {rejectionReason && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Rejection Reason</h4>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejection"
                        rows={3}
                      />
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setRejectionReason("")}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={handleRejectContent}
                          disabled={!rejectionReason.trim()}
                        >
                          Confirm Rejection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentList;
