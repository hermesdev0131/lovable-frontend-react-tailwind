import React, { useState } from 'react';
import { LineChart, PieChart, Users, Layers, ArrowUp, ArrowDown, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deals, opportunities, contacts } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "New contact added", time: "1 hour ago", name: "Sarah Johnson" },
    { id: 2, action: "Deal moved to negotiation", time: "2 hours ago", name: "ACME Corp" },
    { id: 3, action: "New opportunity created", time: "3 hours ago", name: "Global Expansion" },
    { id: 4, action: "Email sent", time: "5 hours ago", name: "Michael Chang" },
    { id: 5, action: "Meeting scheduled", time: "Yesterday", name: "Tech Partners Ltd" },
  ]);
  
  const totalContacts = contacts.length;
  const totalDeals = deals.length;
  const totalOpportunities = opportunities.length;
  
  const openDeals = deals.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage)).length;
  const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
  
  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const potentialValue = opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0);
  
  const taskForm = useForm({
    defaultValues: {
      title: '',
      date: '',
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const handleCardClick = (title: string, path: string) => {
    toast({
      title: `Viewing ${title}`,
      description: "Navigating to detailed view",
      duration: 2000,
    });
    navigate(path);
  };

  const handleCreateTask = (data: { title: string; date: string }) => {
    toast({
      title: "Task Created",
      description: `New task "${data.title}" scheduled for ${data.date}`,
      duration: 3000,
    });
    
    taskForm.reset();
    
    setRecentActivity(prev => [
      { id: Date.now(), action: "Task created", time: "Just now", name: data.title },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="hover:shadow transition-all duration-300 ease-in-out cursor-pointer bg-white text-black dark:bg-card dark:text-card-foreground"
            onClick={() => handleCardClick("Contacts", "/contacts")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalContacts}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                <span className="text-green-500 font-medium flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> 12% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow transition-all duration-300 ease-in-out cursor-pointer bg-white text-black dark:bg-card dark:text-card-foreground"
            onClick={() => handleCardClick("Deals Pipeline", "/pipeline")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{openDeals}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                <span className="flex items-center">
                  <span className="text-green-500 font-medium flex items-center mr-2">
                    <ArrowUp className="h-3 w-3 mr-1" /> {wonDeals} won
                  </span>
                  <span className="text-red-500 font-medium flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1" /> {totalDeals - openDeals - wonDeals} lost
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow transition-all duration-300 ease-in-out cursor-pointer bg-white text-black dark:bg-card dark:text-card-foreground"
            onClick={() => handleCardClick("Opportunities", "/opportunities")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{formatCurrency(totalDealValue)}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                <span className="text-blue-500 font-medium flex items-center">
                  {formatCurrency(potentialValue)} potential
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Deal Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                <p>Pipeline visualization will appear here</p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/pipeline')}
                >
                  View Pipeline
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={item.id} className="flex items-start space-x-3 animate-slide-in-right" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.name} • {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" className="mb-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <Form {...taskForm}>
                      <form onSubmit={taskForm.handleSubmit(handleCreateTask)} className="space-y-4">
                        <FormField
                          control={taskForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Task Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter task title" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={taskForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">Create Task</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                <div className="flex items-center justify-center space-x-3 mt-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center" 
                    onClick={() => navigate('/calendar')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Hot Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {opportunities
                  .filter(opp => opp.probability >= 40)
                  .slice(0, 3)
                  .map((opp, i) => (
                    <div 
                      key={opp.id} 
                      className="animate-slide-in-right cursor-pointer p-2 rounded-md hover:bg-accent/50 transition-colors" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                      onClick={() => {
                        toast({
                          title: opp.name,
                          description: `Potential value: ${formatCurrency(opp.potentialValue)}`,
                          duration: 3000,
                        });
                        navigate('/opportunities');
                      }}
                    >
                      <div className="font-medium truncate">{opp.name}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(opp.potentialValue)}
                        </span>
                        <span className="text-green-500">{opp.probability}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
