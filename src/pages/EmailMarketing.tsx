import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const EmailMarketing = () => {
  const [newEmail, setNewEmail] = useState({
    title: "",
    content: "",
    scheduledFor: undefined as Date | undefined,
  });
  
  const { addContentItem, getContentItems, currentClientId } = useMasterAccount();
  const { toast } = useToast();
  const [emails, setEmails] = useState(getContentItems(currentClientId, 'email'));

  useEffect(() => {
    setEmails(getContentItems(currentClientId, 'email'));
  }, [currentClientId, getContentItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setNewEmail({ ...newEmail, scheduledFor: date });
  };

  const handleCreateEmail = () => {
    if (!newEmail.title || !newEmail.content || !newEmail.scheduledFor) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and select a date",
        variant: "destructive"
      });
      return;
    }
    
    addContentItem({
      title: newEmail.title,
      content: newEmail.content,
      type: "email",
      createdBy: currentClientId || 0,
      scheduledFor: newEmail.scheduledFor.toISOString(),
      clientId: currentClientId,
    });
    
    setNewEmail({ title: "", content: "", scheduledFor: undefined });
    toast({
      title: "Email Scheduled",
      description: `${newEmail.title} has been scheduled successfully.`
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Email</CardTitle>
          <CardDescription>Create and schedule a new email campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Email Title</Label>
              <Input 
                type="text" 
                id="title" 
                name="title" 
                placeholder="Enter email title"
                value={newEmail.title} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <Label htmlFor="scheduledFor">Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newEmail.scheduledFor && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEmail.scheduledFor ? (
                      format(newEmail.scheduledFor, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEmail.scheduledFor}
                    onSelect={handleDateChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter email content"
              value={newEmail.content}
              onChange={handleInputChange}
              className="resize-none"
            />
          </div>
          <Button onClick={handleCreateEmail} className="mt-2">Schedule Email</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Emails</CardTitle>
          <CardDescription>View all scheduled email campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No emails have been scheduled yet</p>
              <Button variant="outline" onClick={() => document.getElementById('title')?.focus()}>
                Schedule Your First Email
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your scheduled email campaigns.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">{email.title}</TableCell>
                    <TableCell>{email.scheduledFor ? format(new Date(email.scheduledFor), "PPP") : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Scheduled</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailMarketing;
