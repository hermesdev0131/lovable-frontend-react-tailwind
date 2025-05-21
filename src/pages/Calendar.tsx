
import React, { useState } from 'react';
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Copy, ExternalLink, Info, Link, Plus, Share2, CalendarIcon, RefreshCw, Pencil, Trash } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CalendarIntegration from '@/components/calendar/CalendarIntegration';
import EditBookingTypeDialog, { BookingType } from '@/components/calendar/EditBookingTypeDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import MakeCalendarIntegration from '@/components/calendar/MakeCalendarIntegration';
import CalendarContacts from '@/components/calendar/CalendarContacts';
import CalendlyBookingSystem from '@/components/calendar/CalendlyBookingSystem';
import { useExternalIntegrations } from '@/hooks/useExternalIntegrations';

const sampleEvents: {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: string;
  contactId?: string;
  dealId?: string;
}[] = [];

const eventTypes = {
  meeting: { label: 'Meeting', color: 'bg-blue-500' },
  demo: { label: 'Demo', color: 'bg-green-500' },
  followup: { label: 'Follow-up', color: 'bg-amber-500' },
  internal: { label: 'Internal', color: 'bg-purple-500' },
};

const defaultBookingTypes: BookingType[] = [
  { id: 'sales-call', name: 'Sales Call', duration: 30 },
  { id: 'product-demo', name: 'Product Demo', duration: 60 },
  { id: 'discovery', name: 'Discovery Call', duration: 45 },
  { id: 'consultation', name: 'Consultation', duration: 60 },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState(sampleEvents);
  const [bookingUrl, setBookingUrl] = useState('');
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>(defaultBookingTypes);
  const [selectedBookingType, setSelectedBookingType] = useState(defaultBookingTypes[0].id);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [activeCalendarType, setActiveCalendarType] = useState<string>("");
  const [editingBookingType, setEditingBookingType] = useState<BookingType | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showContactsTab, setShowContactsTab] = useState(false);
  const { toast } = useToast();
  const { getIntegration, connectIntegration, disconnectIntegration } = useExternalIntegrations();
  const makeIntegration = getIntegration('make');

  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = addDays(endOfMonth(monthEnd), 6);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  const formatEventTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const copyBookingLink = (typeId: string) => {
    setSelectedBookingType(typeId);
    const baseUrl = window.location.origin;
    const generatedUrl = `${baseUrl}/booking/${typeId}`;
    setBookingUrl(generatedUrl);
    
    navigator.clipboard.writeText(generatedUrl);
    toast({
      title: "Booking link copied!",
      description: "The booking link has been copied to your clipboard.",
    });
  };

  const getBookingTypeDetails = (id: string) => {
    return bookingTypes.find(type => type.id === id) || bookingTypes[0];
  };

  const handleEditBookingType = (bookingType: BookingType) => {
    setEditingBookingType(bookingType);
    setShowEditDialog(true);
  };

  const handleDeleteBookingType = (typeId: string) => {
    if (bookingTypes.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one booking type.",
        variant: "destructive",
      });
      return;
    }

    setBookingTypes(prev => prev.filter(type => type.id !== typeId));
    
    if (selectedBookingType === typeId) {
      setSelectedBookingType(bookingTypes.find(type => type.id !== typeId)?.id || '');
    }
    
    toast({
      title: "Booking type deleted",
      description: "The booking type has been deleted.",
    });
  };

  const handleAddBookingType = () => {
    setEditingBookingType(null);
    setShowEditDialog(true);
  };

  const handleSaveBookingType = (bookingType: BookingType) => {
    if (editingBookingType) {
      setBookingTypes(prev => 
        prev.map(type => type.id === editingBookingType.id ? bookingType : type)
      );
      
      toast({
        title: "Booking type updated",
        description: "Your booking type has been updated.",
      });
    } else {
      if (bookingTypes.some(type => type.id === bookingType.id)) {
        let counter = 1;
        let newId = `${bookingType.id}-${counter}`;
        
        while (bookingTypes.some(type => type.id === newId)) {
          counter++;
          newId = `${bookingType.id}-${counter}`;
        }
        
        bookingType.id = newId;
      }
      
      setBookingTypes(prev => [...prev, bookingType]);
      
      toast({
        title: "Booking type created",
        description: "Your new booking type has been created.",
      });
    }
  };

  const handleSyncCalendar = () => {
    toast({
      title: "Syncing calendar...",
      description: "Your events are being synced",
    });
    
    setTimeout(() => {
      toast({
        title: "Calendar Synced",
        description: "Your events have been updated",
      });
    }, 1500);
  };

  const handleCalendarConnect = () => {
    setIsCalendarConnected(true);
    setShowIntegrationDialog(false);
    
    handleSyncCalendar();
  };

  const handleMakeIntegrationChange = (connected: boolean) => {
    if (connected) {
      connectIntegration('make', { 
        webhookUrls: { calendar: 'https://hook.make.com/example' } 
      });
      
      toast({
        title: "Make.com Integration Enabled",
        description: "Calendar events will now sync with Make.com"
      });
    } else {
      disconnectIntegration('make');
      
      toast({
        title: "Make.com Integration Disabled",
        description: "Calendar events will no longer sync with Make.com"
      });
    }
  };

  const handleContactAdded = () => {
    // Refresh calendar events when a contact is added
    toast({
      title: "Calendar Updated",
      description: "Contact has been linked to your calendar"
    });
    
    // For demo purposes, this would typically reload events
    handleSyncCalendar();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="month">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="booking">Booking Links</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="contacts" onClick={() => setShowContactsTab(true)}>Contacts</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex items-center gap-2">
              {isCalendarConnected && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSyncCalendar}
                >
                  <ChevronRight className="h-4 w-4 mr-1" /> Sync
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="ml-2 font-medium text-sm">
                {format(currentDate, 'MMMM yyyy')}
              </span>
            </div>
          </div>

          <TabsContent value="month" className="mt-0">
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center py-2 font-medium text-sm">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const today = isToday(day);
                const dayEvents = getEventsForDate(day);
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-1 border border-border rounded-md transition-all ${
                      isCurrentMonth 
                        ? 'bg-background' 
                        : 'bg-muted/30 opacity-60'
                    } ${
                      isSelected 
                        ? 'ring-2 ring-primary' 
                        : ''
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`flex items-center justify-center h-6 w-6 text-xs rounded-full ${
                          today
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      
                      {dayEvents.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {dayEvents.length}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 overflow-hidden max-h-[80px]">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`px-1 py-0.5 text-xs rounded-sm truncate ${
                            eventTypes[event.type as keyof typeof eventTypes]?.color || 'bg-gray-300'
                          } text-white`}
                        >
                          {formatEventTime(event.start)} {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {selectedDate && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Event
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map((event) => (
                      <Card key={event.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle>{event.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1" /> 
                                {formatEventTime(event.start)} - {formatEventTime(event.end)}
                              </CardDescription>
                            </div>
                            <Badge className={eventTypes[event.type as keyof typeof eventTypes]?.color}>
                              {eventTypes[event.type as keyof typeof eventTypes]?.label}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No events scheduled for this day</p>
                      <Button variant="outline" className="mt-4">
                        <Plus className="h-4 w-4 mr-1" /> Create Event
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="week">
            <div className="py-10 text-center">
              <h3 className="text-lg font-medium mb-2">Week View</h3>
              <p className="text-muted-foreground mb-4">Week view coming soon!</p>
              <Button variant="outline">Go to Month View</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="booking">
            <div className="grid grid-cols-1 gap-8">
              <CalendlyBookingSystem 
                bookingTypes={bookingTypes}
                onAddBookingType={handleAddBookingType}
                onEditBookingType={handleEditBookingType}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Your Booking Links</CardTitle>
                      <CardDescription>
                        Create and share booking links for prospects and clients
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={handleAddBookingType}>
                      <Plus className="h-4 w-4 mr-1" /> New Type
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookingTypes.map((type) => (
                        <div key={type.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {type.duration} min
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyBookingLink(type.id)}
                            >
                              <Copy className="h-4 w-4 mr-1" /> Copy
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditBookingType(type)}>
                                  <Pencil className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500"
                                  onClick={() => handleDeleteBookingType(type.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Settings</CardTitle>
                    <CardDescription>
                      Customize your booking page and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bookingUrl && (
                      <Alert>
                        <Link className="h-4 w-4" />
                        <AlertTitle>Booking link copied!</AlertTitle>
                        <AlertDescription className="break-all">
                          <div className="font-mono text-xs mt-1">{bookingUrl}</div>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="booking-name">Booking Page Title</Label>
                      <Input 
                        id="booking-name" 
                        defaultValue={`${getBookingTypeDetails(selectedBookingType).name} with Your Name`} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span>Business Hours (9am-5pm)</span>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="text-center py-4 px-2">
                            <p className="text-sm">Availability settings coming soon</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Share Your Booking Page</h4>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-1" /> Share
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-1" /> Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <CalendarContacts onContactAdded={handleContactAdded} />
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Deals</CardTitle>
                    <CardDescription>
                      Manage meetings associated with your deals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {events.filter(e => e.dealId).length > 0 ? (
                      <div className="space-y-4">
                        {/* Deal-related events would be shown here */}
                        <p>Deal-related meetings would appear here.</p>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No deal meetings found</p>
                        <p className="text-sm mb-4">Meetings related to your deals will appear here</p>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-1" /> Schedule Deal Meeting
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar Integrations</CardTitle>
                    <CardDescription>
                      Connect your external calendars to sync events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isCalendarConnected ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border rounded-md">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{activeCalendarType === 'google' ? 'Google Calendar' : 'Outlook Calendar'}</div>
                            <div className="text-sm text-muted-foreground">Connected • Last synced just now</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleSyncCalendar}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" /> Sync
                          </Button>
                        </div>
                        
                        <Alert className="bg-muted/50">
                          <Info className="h-4 w-4" />
                          <AlertTitle>Automatic Sync</AlertTitle>
                          <AlertDescription>
                            Your calendar will automatically sync every 30 minutes.
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border border-dashed rounded-md">
                          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Google Calendar</div>
                            <div className="text-sm text-muted-foreground">Import events from Google Calendar</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setActiveCalendarType("google");
                              setShowIntegrationDialog(true);
                            }}
                          >
                            Connect
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 border border-dashed rounded-md">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Outlook Calendar</div>
                            <div className="text-sm text-muted-foreground">Import events from Outlook Calendar</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setActiveCalendarType("outlook");
                              setShowIntegrationDialog(true);
                            }}
                          >
                            Connect
                          </Button>
                        </div>

                        {/* Make.com Integration */}
                        {/* <MakeCalendarIntegration 
                          onIntegrationChange={handleMakeIntegrationChange} 
                        /> */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Settings</CardTitle>
                    <CardDescription>
                      Configure how your calendars sync
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-visibility">Event Visibility</Label>
                      <select 
                        id="event-visibility" 
                        className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                        disabled={!isCalendarConnected}
                      >
                        <option value="all">All Events</option>
                        <option value="busy">Busy Times Only</option>
                        <option value="custom">Custom Filter</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Control which events from your calendar are imported
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sync-frequency">Sync Frequency</Label>
                      <select 
                        id="sync-frequency" 
                        className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                        disabled={!isCalendarConnected}
                      >
                        <option value="15">Every 15 minutes</option>
                        <option value="30">Every 30 minutes</option>
                        <option value="60">Every hour</option>
                        <option value="manual">Manual only</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="calendar-categories">Calendar Categories</Label>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="outline" className="cursor-pointer">
                          Default ✓
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer opacity-50">
                          Work
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer opacity-50">
                          Personal
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer opacity-50">
                          Family
                        </Badge>
                        <Badge variant="outline" className="border-dashed">
                          + Add
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={!isCalendarConnected}>Save Settings</Button>
                  </CardFooter>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Learn how to set up and use calendar integrations effectively.
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-1">
                        <Info className="h-3.5 w-3.5 mr-1" /> View Documentation
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
        <DialogContent className="sm:max-w-md">
          <CalendarIntegration 
            onSync={() => {
              setIsCalendarConnected(true);
              setActiveCalendarType(activeCalendarType);
              handleCalendarConnect();
            }} 
            onClose={() => setShowIntegrationDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <EditBookingTypeDialog 
        bookingType={editingBookingType}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveBookingType}
      />
    </div>
  );
};

export default Calendar;
