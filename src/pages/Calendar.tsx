
import React, { useState } from 'react';
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Copy, ExternalLink, Info, Link, Plus, Share2 } from 'lucide-react';
import { Calendar as CalendarIcon } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: 'Client Meeting: ABC Corp',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    type: 'meeting',
  },
  {
    id: 2,
    title: 'Product Demo',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    type: 'demo',
  },
  {
    id: 3,
    title: 'Contract Review',
    start: addDays(new Date(), 1),
    end: addDays(new Date(), 1),
    type: 'followup',
  },
  {
    id: 4,
    title: 'Team Sync',
    start: addDays(new Date(), 2),
    end: addDays(new Date(), 2),
    type: 'internal',
  },
];

// Event types with colors
const eventTypes = {
  meeting: { label: 'Meeting', color: 'bg-blue-500' },
  demo: { label: 'Demo', color: 'bg-green-500' },
  followup: { label: 'Follow-up', color: 'bg-amber-500' },
  internal: { label: 'Internal', color: 'bg-purple-500' },
};

// Booking types
const bookingTypes = [
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
  const [selectedBookingType, setSelectedBookingType] = useState(bookingTypes[0].id);
  const { toast } = useToast();

  // Navigation functions
  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Calculate dates for the calendar
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = addDays(endOfMonth(monthEnd), 6);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  // Format time from date
  const formatEventTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Handle copy booking link
  const copyBookingLink = () => {
    // In a real app, this would generate a unique link
    const baseUrl = window.location.origin;
    const generatedUrl = `${baseUrl}/booking/${selectedBookingType}`;
    setBookingUrl(generatedUrl);
    
    navigator.clipboard.writeText(generatedUrl);
    toast({
      title: "Booking link copied!",
      description: "The booking link has been copied to your clipboard.",
    });
  };

  // Get booking type details
  const getBookingTypeDetails = (id: string) => {
    return bookingTypes.find(type => type.id === id) || bookingTypes[0];
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
              </TabsList>
            </div>
            
            <div className="flex items-center gap-2">
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
            {/* Calendar grid */}
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
            
            {/* Selected day details */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Booking Links</CardTitle>
                    <CardDescription>
                      Create and share booking links for prospects and clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {bookingTypes.map((type) => (
                        <div key={type.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {type.duration} min
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedBookingType(type.id);
                              copyBookingLink();
                            }}
                          >
                            <Copy className="h-4 w-4 mr-1" /> Copy Link
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-1" /> Create New Booking Type
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
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
                
                <div className="mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Learn how to use booking links effectively to schedule meetings with your clients and prospects.
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-1">
                        <Info className="h-3.5 w-3.5 mr-1" /> View Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Calendar;
