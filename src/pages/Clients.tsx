import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useMasterAccount();
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const clientSchema = z.object({
    name: z.string().min(2, {
      message: "Client name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    industry: z.string().min(2, {
      message: "Industry must be at least 2 characters.",
    }),
    website: z.string().url({
      message: "Invalid website URL.",
    }),
    logo: z.string().url({
      message: "Invalid logo URL.",
    }).optional(),
    subscription: z.enum(["Basic", "Professional", "Enterprise"]),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })

  const addClientForm = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      industry: "",
      website: "",
      logo: "",
      subscription: "Basic",
      password: "",
    },
  })

  const editClientForm = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      industry: "",
      website: "",
      logo: "",
      subscription: "Basic",
      password: "",
    },
  })

  const handleAddClient = (data: any) => {
    addClient({
      name: data.name,
      email: data.email,
      industry: data.industry,
      website: data.website,
      logo: data.logo || "",
      status: "active" as const,
      subscription: data.subscription as "Basic" | "Professional" | "Enterprise", // Fix the type
      users: 1,
      deals: 0,
      contacts: 0,
      lastActivity: new Date().toISOString(),
      password: data.password
    });
    
    addClientForm.reset();
    setIsAddClientDialogOpen(false);
  };

  const handleEditClient = (data: any) => {
    if (selectedClient) {
      updateClient({
        id: selectedClient.id,
        name: data.name,
        email: data.email,
        industry: data.industry,
        website: data.website,
        logo: data.logo || "",
        status: selectedClient.status,
        subscription: data.subscription,
        users: selectedClient.users,
        deals: selectedClient.deals,
        contacts: selectedClient.contacts,
        lastActivity: selectedClient.lastActivity,
        password: data.password
      });
      setIsEditClientDialogOpen(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(clientId);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const openEditClientDialog = (client) => {
    setSelectedClient(client);
    editClientForm.reset({
      name: client.name,
      email: client.email,
      industry: client.industry,
      website: client.website,
      logo: client.logo,
      subscription: client.subscription,
      password: client.password || "",
    });
    setIsEditClientDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => setIsAddClientDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Client</Button>
      </div>

      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                Name {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                Email {sortColumn === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('industry')} className="cursor-pointer">
                Industry {sortColumn === 'industry' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('subscription')} className="cursor-pointer">
                Subscription {sortColumn === 'subscription' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.map(client => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{client.subscription}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditClientDialog(client)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClient(client.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Add Client Dialog */}
      <AlertDialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Client</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for the new client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...addClientForm}>
            <form onSubmit={addClientForm.handleSubmit(handleAddClient)} className="space-y-4">
              <FormField
                control={addClientForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Email" {...field} />
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
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Industry" {...field} />
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
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addClientForm.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Logo URL" {...field} />
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
                    <FormLabel>Subscription</FormLabel>
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
              <FormField
                control={addClientForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Add Client</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Client Dialog */}
      <AlertDialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Client</AlertDialogTitle>
            <AlertDialogDescription>
              Update the details for the selected client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...editClientForm}>
            <form onSubmit={editClientForm.handleSubmit(handleEditClient)} className="space-y-4">
              <FormField
                control={editClientForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editClientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editClientForm.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Industry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editClientForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editClientForm.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Logo URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editClientForm.control}
                name="subscription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription</FormLabel>
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
              <FormField
                control={editClientForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Update Client</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
