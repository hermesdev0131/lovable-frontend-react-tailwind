import React, { useState, useEffect } from 'react';
import { Client } from '@/contexts/MasterAccountContext';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  industry: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
  subscription: z.enum(["Basic", "Professional", "Enterprise"]),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

const MasterAccount = () => {
  const { clients, addClient, updateClient, removeClient } = useMasterAccount();
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      industry: "",
      website: "",
      logo: "",
      subscription: "Basic",
      password: ""
    },
  })

  const addClientForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      industry: "",
      website: "",
      logo: "",
      subscription: "Basic",
      password: ""
    },
  })

  const { reset } = addClientForm;

  const handleAddClient = (data: any) => {
    addClient({
      name: data.name,
      email: data.email,
      industry: data.industry,
      website: data.website,
      logo: data.logo || "",
      status: "active" as const,
      subscription: data.subscription as "Basic" | "Professional" | "Enterprise",
      users: 1,
      deals: 0,
      contacts: 0,
      lastActivity: new Date().toISOString(),
      password: data.password
    });
    
    setIsAddClientDialogOpen(false);
    reset();
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    form.setValue("name", client.name);
    form.setValue("email", client.email || "");
    form.setValue("industry", client.industry || "");
    form.setValue("website", client.website || "");
    form.setValue("logo", client.logo || "");
    form.setValue("subscription", client.subscription);
    setIsEditClientDialogOpen(true);
  };

  const handleUpdateClient = (data: any) => {
    if (selectedClient) {
      const updatedClient = {
        id: selectedClient.id,
        name: data.name,
        email: data.email,
        industry: data.industry,
        website: data.website,
        logo: data.logo,
        status: selectedClient.status,
        subscription: data.subscription,
        users: selectedClient.users,
        deals: selectedClient.deals,
        contacts: selectedClient.contacts,
        lastActivity: selectedClient.lastActivity,
        password: data.password
      };
      updateClient(updatedClient);
      setIsEditClientDialogOpen(false);
      setSelectedClient(null);
      form.reset();
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      removeClient(clientId);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Master Account Dashboard</h1>
        <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
      </div>

      <div className="mb-6">
        <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Client</DialogTitle>
              <DialogDescription>
                Create a new client account.
              </DialogDescription>
            </DialogHeader>
            <Form {...addClientForm}>
              <form onSubmit={addClientForm.handleSubmit(handleAddClient)} className="space-y-4">
                <FormField
                  control={addClientForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Name</Label>
                      <FormControl>
                        <Input id="name" placeholder="Client Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addClientForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input id="email" placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addClientForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Password</Label>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addClientForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="industry">Industry</Label>
                      <FormControl>
                        <Input id="industry" placeholder="e.g. Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addClientForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="website">Website</Label>
                      <FormControl>
                        <Input id="website" placeholder="www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addClientForm.control}
                  name="subscription"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="subscription">Subscription</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subscription" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" className="w-full" disabled={addClientForm.formState.isSubmitting}>
                  {addClientForm.formState.isSubmitting ? "Adding..." : "Add Client"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your client accounts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>{client.subscription}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Make changes to the selected client account.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateClient)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Name</Label>
                    <FormControl>
                      <Input id="name" placeholder="Client Name" {...field} />
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
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input id="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="industry">Industry</Label>
                    <FormControl>
                      <Input id="industry" placeholder="e.g. Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="website">Website</Label>
                    <FormControl>
                      <Input id="website" placeholder="www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscription"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="subscription">Subscription</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subscription" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Client</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterAccount;
