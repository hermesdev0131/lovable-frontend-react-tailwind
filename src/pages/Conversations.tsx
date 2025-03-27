import React, { useState } from 'react';
import { Bot, MessageCircle, Phone, MessageSquare, Filter, Search, Calendar, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockConversations: {
  id: string;
  channel: 'voice' | 'sms';
  contact: string;
  phoneNumber: string;
  date: string;
  duration: string;
  status: 'completed' | 'failed';
  bot: string;
  summary: string;
}[] = [];

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [botFilter, setBotFilter] = useState('all');
  const [filteredConversations, setFilteredConversations] = useState(mockConversations);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, channelFilter, botFilter);
  };
  
  const handleChannelFilter = (value: string) => {
    setChannelFilter(value);
    applyFilters(searchTerm, value, botFilter);
  };
  
  const handleBotFilter = (value: string) => {
    setBotFilter(value);
    applyFilters(searchTerm, channelFilter, value);
  };
  
  const applyFilters = (search: string, channel: string, bot: string) => {
    let filtered = mockConversations;
    
    if (search) {
      filtered = filtered.filter(convo => 
        convo.contact.toLowerCase().includes(search.toLowerCase()) || 
        convo.summary.toLowerCase().includes(search.toLowerCase()) ||
        convo.phoneNumber.includes(search)
      );
    }
    
    if (channel !== 'all') {
      filtered = filtered.filter(convo => convo.channel === channel);
    }
    
    if (bot !== 'all') {
      filtered = filtered.filter(convo => convo.bot === bot);
    }
    
    setFilteredConversations(filtered);
  };
  
  const botOptions = Array.from(new Set(mockConversations.map(convo => convo.bot)));
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight">AI Conversations</h2>
        <p className="text-muted-foreground">Track and analyze conversations handled by your AI assistants</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>Conversation History</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date Range</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by contact, phone or summary..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-40">
                  <Select value={channelFilter} onValueChange={handleChannelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="voice">Voice Calls</SelectItem>
                      <SelectItem value="sms">SMS Messages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <Select value={botFilter} onValueChange={handleBotFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bots</SelectItem>
                      {botOptions.map(bot => (
                        <SelectItem key={bot} value={bot}>{bot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Channel</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>AI Assistant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[300px]">Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map(convo => (
                      <TableRow key={convo.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {convo.channel === 'voice' ? (
                              <Phone className="h-4 w-4 text-primary" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-primary" />
                            )}
                            <span className="capitalize">{convo.channel}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{convo.contact}</TableCell>
                        <TableCell>{convo.phoneNumber}</TableCell>
                        <TableCell>{new Date(convo.date).toLocaleString()}</TableCell>
                        <TableCell>{convo.duration}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                            {convo.bot}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            convo.status === 'completed' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {convo.status === 'completed' ? 'Completed' : 'Failed'}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{convo.summary}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No conversations found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 w-[400px]">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0%</div>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Avg. Call Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0:00</div>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transcripts">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                  <h3 className="text-lg font-medium mb-2">No conversations available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Conversations will appear here once you start using AI assistants with your contacts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="vapi" className="text-sm font-medium">Vapi API Key</label>
                  <Input id="vapi" type="password" placeholder="Enter your Vapi API key" />
                  <p className="text-xs text-muted-foreground">Used for voice call tracking and management</p>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="sendblue" className="text-sm font-medium">SendBlue API Key</label>
                  <Input id="sendblue" type="password" placeholder="Enter your SendBlue API key" />
                  <p className="text-xs text-muted-foreground">Used for SMS message tracking</p>
                </div>
                
                <Button className="mt-4">Update Integration Keys</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Conversations;
