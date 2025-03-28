import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Copy, Send, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { useAuth } from '@/contexts/AuthContext';

const EmailMarketing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addContentItem, getContentItems, updateContentStatus } = useMasterAccount();
  const { currentClientId } = useMasterAccount();
  const { currentUser } = useAuth();
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"draft" | "scheduled" | "published">("draft");
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [emails, setEmails] = useState(getContentItems(currentClientId, "email"));

  useEffect(() => {
    setEmails(getContentItems(currentClientId, "email"));
  }, [currentClientId, getContentItems]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      subject: '',
      content: '',
      scheduledFor: undefined,
    }
  });

  const addEmail = (data: any) => {
    addContentItem({
      title: data.subject,
      content: data.content,
      type: "email",
      status: "draft", // Add the required status property
      createdBy: currentUser?.id || "system",
      scheduledFor: data.scheduledFor,
      clientId: currentClientId
    });
    
    toast({
      title: "Email campaign created",
      description: "Your email campaign has been created successfully",
    });
    
    reset();
    setIsModalOpen(false);
  };

  const handleStatusUpdate = (itemId: number, status: "draft" | "scheduled" | "published") => {
    updateContentStatus(itemId, status);
    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === itemId ? { ...email, status: status } : email
      )
    );
    toast({
      title: "Email status updated",
      description: "Email status has been updated successfully",
    });
  };

  const toggleEmailSelection = (emailId: number) => {
    setSelectedEmails(prev => {
      if (prev.includes(emailId)) {
        return prev.filter(id => id !== emailId);
      } else {
        return [...prev, emailId];
      }
    });
  };

  const handleBulkUpdate = () => {
    if (selectedEmails.length === 0) {
      toast({
        title: "No emails selected",
        description: "Please select emails to update",
        variant: "destructive",
      });
      return;
    }

    selectedEmails.forEach(emailId => {
      updateContentStatus(emailId, selectedStatus);
      setEmails(prevEmails =>
        prevEmails.map(email =>
          email.id === emailId ? { ...email, status: selectedStatus } : email
        )
      );
    });

    toast({
      title: "Emails updated",
      description: "Selected emails have been updated successfully",
    });

    setSelectedEmails([]);
    setIsBulkUpdateModalOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Email Marketing</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">Create New Email</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Email</DialogTitle>
              <DialogDescription>
                Create a new email campaign to engage with your audience.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(addEmail)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Email Subject" type="text" {...register("subject", { required: "Subject is required" })} />
                {errors.subject && <p className="text-red-500">{errors.subject.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Email Content" className="min-h-[100px]" {...register("content", { required: "Content is required" })} />
                {errors.content && <p className="text-red-500">{errors.content.message}</p>}
              </div>
              <div>
                <Label>Schedule For</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !register("scheduledFor") && "text-muted-foreground"
                      )}
                    >
                      {register("scheduledFor") ? (
                        format(new Date(), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={register("scheduledFor") ? new Date() : undefined}
                      onSelect={(date) => {
                        if (date) {
                          reset({ ...register(), scheduledFor: date });
                        }
                      }}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit">Create Email</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bulk Update Modal */}
      <Dialog open={isBulkUpdateModalOpen} onOpenChange={setIsBulkUpdateModalOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" disabled={selectedEmails.length === 0}>
            Bulk Update
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bulk Update Emails</DialogTitle>
            <DialogDescription>
              Update the status of selected emails.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setSelectedStatus(value as "draft" | "scheduled" | "published")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleBulkUpdate}>Update Emails</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of your email campaigns.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Scheduled For</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id}>
                <TableCell className="font-medium">
                  <Input
                    type="checkbox"
                    checked={selectedEmails.includes(email.id)}
                    onChange={() => toggleEmailSelection(email.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{email.title}</TableCell>
                <TableCell>
                  <Select onValueChange={(value) => handleStatusUpdate(email.id, value as "draft" | "scheduled" | "published")}>
                    <SelectTrigger>
                      <SelectValue placeholder={email.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{email.createdBy}</TableCell>
                <TableCell>{email.scheduledFor}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="ghost">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                  <Button variant="ghost" className="text-red-500">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmailMarketing;
