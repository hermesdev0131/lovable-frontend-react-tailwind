
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Building, Mail, Phone, Calendar, Tag, 
  ChevronLeft, Edit, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { formatDate } from '@/utils/formatters';
import { toast } from '@/hooks/use-toast';

const ClientProfile = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { clients, removeClient } = useMasterAccount();
  const [client, setClient] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!clientId) {
      navigate('/clients');
      return;
    }

    console.log("Looking for client with ID:", clientId);
    console.log("Available clients:", clients);
    
    // No need to parse clientId as it's already a string
    const clientData = clients.find(c => c.id === clientId);
    if (clientData) {
      console.log("Client found:", clientData);
      setClient(clientData);
    } else {
      if (clients.length > 0) {
        console.log("Client not found in loaded clients");
        navigate('/clients');
        toast({
          title: "Client not found",
          description: "The client you're looking for doesn't exist.",
          variant: "destructive"
        });
      } else {
        console.log("No clients loaded yet, waiting...");
      }
    }
  }, [clientId, clients, navigate]);

  const handleDelete = () => {
    if (isDeleting && clientId) {
      removeClient(clientId);
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted."
      });
      navigate('/clients');
    } else {
      setIsDeleting(true);
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  if (!client) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              Loading client data...
            </CardTitle>
            <CardDescription className="text-center mt-2">
              {clients.length === 0 
                ? "Waiting for clients to load..." 
                : "Preparing client profile..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => navigate('/clients')}>
              Back to Clients List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/clients')}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Clients
        </Button>
        <h1 className="text-2xl font-bold">Client Profile</h1>
      </div>

      {/* Client Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {getInitials(client.firstName, client.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{client.firstName} {client.lastName}</CardTitle>
              <CardDescription className="mt-1">
                {client.company && (
                  <span className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-muted-foreground" /> 
                    {client.company}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>

            {isDeleting ? (
              <>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                </Button>
                <Button variant="outline" size="sm" onClick={cancelDelete}>
                  <XCircle className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Client Type: {client.leadType}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Created: {formatDate(client.lastActivity)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Source: {client.leadSource}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm"></span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Email Addresses */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Email Addresses</h3>
                <div className="space-y-2">
                  {client.emails.map((email: string, idx: number) => (
                    <div key={`email-${idx}`} className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{email}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Phone Numbers */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Phone Numbers</h3>
                <div className="space-y-2">
                  {client.phoneNumbers.map((phone: string, idx: number) => (
                    <div key={`phone-${idx}`} className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{phone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {client.tags && client.tags.length > 0 ? (
                    client.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <div className="text-center py-6">
                <p className="text-muted-foreground">Contact management coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="deals">
              <div className="text-center py-6">
                <p className="text-muted-foreground">Deal tracking coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div>Client ID: {client.id}</div>
          <div>Last updated: {formatDate(client.lastActivity)}</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientProfile;
