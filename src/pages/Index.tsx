
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
  const [recentActivity, setRecentActivity] = useState<{
    id: number;
    action: string;
    time: string;
    name: string;
  }[]>([]);
  
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
                {totalContacts === 0 ? (
                  <span className="text-muted-foreground font-medium">
                    No contacts added yet
                  </span>
                ) : (
                  <span className="text-muted-foreground font-medium">
                    {totalContacts} total contacts
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow transition-all duration-300 ease-in-out cursor-pointer bg-white text-black dark:bg-card dark:text-card-foreground"
            onClick={() => handleCardClick("Deals", "/deals")}
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
                {openDeals === 0 ? (
                  <span className="text-muted-foreground font-medium">
                    No active deals
                  </span>
                ) : (
                  <span className="text-muted-foreground font-medium">
                    {openDeals} active deals in progress
                  </span>
                )}
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
                {totalDealValue === 0 ? (
                  <span className="text-muted-foreground font-medium">
                    No value in pipeline yet
                  </span>
                ) : (
                  <span className="text-muted-foreground font-medium">
                    {formatCurrency(totalDealValue)} total pipeline value
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Deal Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                <p>Add deals to see your deal overview</p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/deals')}
                >
                  View Deals
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
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
              ) : (
                <div className="h-[200px] flex items-center justify-center text-center">
                  <div>
                    <p className="text-muted-foreground mb-2">No recent activity</p>
                    <p className="text-sm text-muted-foreground">Your activity will appear here</p>
                  </div>
                </div>
              )}
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
                
                <p className="mt-4">No tasks scheduled</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Hot Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px] flex items-center justify-center text-center">
                <div>
                  <p className="text-muted-foreground mb-2">No opportunities</p>
                  <p className="text-sm text-muted-foreground">
                    Add opportunities to start tracking potential deals
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => navigate('/opportunities')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Opportunity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
