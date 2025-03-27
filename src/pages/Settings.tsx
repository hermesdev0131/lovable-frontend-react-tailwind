import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { CheckCheck, Copy, PlusCircle, Settings as SettingsIcon, Trash2, AlertCircle } from "lucide-react";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { Webhook } from '@/types/content';

interface SettingsFormValues {
  name: string;
  email: string;
  logo: string;
}

interface WebhookFormValues {
  name: string;
  url: string;
  event: string;
}

const Settings = () => {
  const { currentClientId, clients, switchClient, isInMasterMode, toggleMasterMode, updateWebhookStatus, webhooks } = useMasterAccount();
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [selectedWebhookId, setSelectedWebhookId] = useState<number | null>(null);
  const [isApiKeyCopied, setIsApiKeyCopied] = useState(false);
  const [apiKey, setApiKey] = useState("sk_test_1234567890abcdef"); // Mock API key
  
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      name: clients.find(c => c.id === currentClientId)?.name || "",
      email: clients.find(c => c.id === currentClientId)?.email || "",
      logo: clients.find(c => c.id === currentClientId)?.logo || "",
    }
  });
  
  const webhookForm = useForm<WebhookFormValues>({
    defaultValues: {
      name: '',
      url: '',
      event: 'content.create'
    }
  });
  
  useEffect(() => {
    if (currentClientId) {
      const currentClient = clients.find(c => c.id === currentClientId);
      form.reset({
        name: currentClient?.name || "",
        email: currentClient?.email || "",
        logo: currentClient?.logo || "",
      });
    }
  }, [currentClientId, clients, form]);

  const handleClientUpdate = (values: SettingsFormValues) => {
    toast({
      title: "Client settings updated.",
      description: "Your settings have been saved successfully.",
    })
  };
  
  const handleWebhookSubmit = (values: WebhookFormValues) => {
    // Placeholder for webhook submission logic
    console.log("Webhook values:", values);
    setIsWebhookDialogOpen(false);
    webhookForm.reset();
    toast({
      title: "Webhook created",
      description: "Your webhook has been successfully created",
    })
  };

  const handleApiKeyRegenerate = () => {
    // Placeholder for API key regeneration logic
    setApiKey("sk_test_" + Math.random().toString(36).substring(2, 15));
    toast({
      title: "API key regenerated",
      description: "Your API key has been successfully regenerated. Please save it as it will not be shown again.",
    })
  };

  const handleApiKeyCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setIsApiKeyCopied(true);
    setTimeout(() => setIsApiKeyCopied(false), 2000);
  };
  
  const toggleWebhookStatus = (webhookId: number) => {
    // Find the webhook
    const webhook = webhooks.find(w => w.id === webhookId);
    if (webhook) {
      // Toggle its status and update with the current timestamp for lastTriggered
      updateWebhookStatus(webhookId, !webhook.active);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        {isInMasterMode && (
          <Button variant="outline" onClick={toggleMasterMode}>
            Exit Master Mode
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Manage your client settings and information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleClientUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Email Address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Logo URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Client Info</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isInMasterMode && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Clients</CardTitle>
            <CardDescription>
              Switch between different client accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => switchClient(client.id)}>
                        Switch to
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="link" onClick={() => setIsClientDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for secure access to our services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="api-key">Current API Key</Label>
              <Input
                id="api-key"
                className="w-full md:w-[400px] mt-2"
                type="text"
                value={apiKey}
                readOnly
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleApiKeyCopy} disabled={isApiKeyCopied}>
              {isApiKeyCopied ? (
                <>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <Button onClick={handleApiKeyRegenerate}>Regenerate API Key</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Configure webhooks to receive real-time updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>{webhook.event}</TableCell>
                  <TableCell>
                    <Switch
                      id={`webhook-${webhook.id}`}
                      checked={webhook.active}
                      onCheckedChange={() => toggleWebhookStatus(webhook.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {webhook.lastTriggered && (
                      <div className="text-xs text-muted-foreground">
                        Last triggered: {formatDate(webhook.lastTriggered)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="link" onClick={() => setIsWebhookDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Webhook
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client to manage their settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value="" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsClientDialogOpen(false)}>Cancel</Button>
            <Button type="submit">Create Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Webhook</DialogTitle>
            <DialogDescription>
              Configure a new webhook to receive real-time updates.
            </DialogDescription>
          </DialogHeader>
          <Form {...webhookForm}>
            <form onSubmit={webhookForm.handleSubmit(handleWebhookSubmit)} className="space-y-4">
              <FormField
                control={webhookForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Webhook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={webhookForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Endpoint</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/webhook" type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={webhookForm.control}
                name="event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Trigger</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="content.create">Content Create</SelectItem>
                        <SelectItem value="content.update">Content Update</SelectItem>
                        <SelectItem value="content.delete">Content Delete</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsWebhookDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Webhook</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
