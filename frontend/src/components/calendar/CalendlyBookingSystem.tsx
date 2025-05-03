
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Copy, ExternalLink, Settings, Share2, Clock, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { BookingType } from '@/components/calendar/EditBookingTypeDialog';

interface CalendlyBookingSystemProps {
  bookingTypes: BookingType[];
  onAddBookingType: () => void;
  onEditBookingType: (type: BookingType) => void;
}

const CalendlyBookingSystem: React.FC<CalendlyBookingSystemProps> = ({
  bookingTypes,
  onAddBookingType,
  onEditBookingType
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBookingType, setSelectedBookingType] = useState<string>(bookingTypes[0]?.id || "");
  const [showPreview, setShowPreview] = useState(false);
  const [bookingLink, setBookingLink] = useState("");
  const [availableTimes, setAvailableTimes] = useState([
    "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]);
  const [isAutoAccept, setIsAutoAccept] = useState(true);
  const [bufferTime, setBufferTime] = useState("15");

  // Generate a booking link when booking type changes
  React.useEffect(() => {
    if (selectedBookingType) {
      const selectedType = bookingTypes.find(type => type.id === selectedBookingType);
      if (selectedType) {
        const baseUrl = window.location.origin;
        setBookingLink(`${baseUrl}/booking/${selectedType.id}`);
      }
    }
  }, [selectedBookingType, bookingTypes]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    toast({
      title: "Link copied!",
      description: "Booking link has been copied to clipboard",
    });
  };

  const handleTimeClick = (time: string) => {
    // Simulate booking selection
    toast({
      title: "Time selected",
      description: `You selected ${time} on ${selectedDate ? format(selectedDate, "PPPP") : ""}`,
    });
  };

  const handlePreviewBooking = () => {
    setShowPreview(true);
  };

  const handleCreateBooking = () => {
    toast({
      title: "Booking created",
      description: "Your booking page is now live and ready to share",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking System</CardTitle>
        <CardDescription>Create and manage your booking pages</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="create">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="create" className="flex-1">Create Booking</TabsTrigger>
            <TabsTrigger value="manage" className="flex-1">Manage Bookings</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-type">Booking Type</Label>
                  <Select value={selectedBookingType} onValueChange={setSelectedBookingType}>
                    <SelectTrigger id="booking-type">
                      <SelectValue placeholder="Select a booking type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} ({type.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex justify-between">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="px-0 h-auto text-xs"
                      onClick={onAddBookingType}
                    >
                      + Add new booking type
                    </Button>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="px-0 h-auto text-xs"
                      onClick={() => {
                        const type = bookingTypes.find(t => t.id === selectedBookingType);
                        if (type) onEditBookingType(type);
                      }}
                      disabled={!selectedBookingType}
                    >
                      Edit this booking type
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Select Available Dates</Label>
                  <div className="border rounded-md">
                    <Calendar 
                      mode="single" 
                      selected={selectedDate} 
                      onSelect={setSelectedDate} 
                      className="rounded-md border" 
                    />
                  </div>
                </div>
                
                {selectedDate && (
                  <div className="space-y-2">
                    <Label>Available Times for {format(selectedDate, "PPPP")}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleTimeClick(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={handlePreviewBooking}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleCreateBooking}>
                    Create Booking Page
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Booking Link</Label>
                  <div className="flex">
                    <Input 
                      value={bookingLink} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button 
                      variant="secondary" 
                      className="rounded-l-none" 
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this link with your clients to allow them to book time with you
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Share Options</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                </div>
                
                {showPreview && (
                  <div className="border rounded-md p-4 mt-4">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Booking Preview</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This is how your booking page will appear to clients
                      </p>
                      
                      <div className="py-4 px-6 border rounded-md mb-4">
                        <h4 className="font-medium">
                          {bookingTypes.find(t => t.id === selectedBookingType)?.name}
                        </h4>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                          <Clock className="h-4 w-4" /> 
                          <span>{bookingTypes.find(t => t.id === selectedBookingType)?.duration} min</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="border-t pt-4">
                            <p className="text-center mb-2">Select a date & time</p>
                            <div className="flex justify-center gap-2">
                              {["10:00 AM", "11:00 AM", "1:00 PM"].map((time) => (
                                <Button
                                  key={time}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="manage" className="p-4">
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  You have no upcoming bookings. Share your booking link to start receiving appointments.
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Active Booking Pages</h3>
                <div className="space-y-2">
                  {bookingTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{type.name}</p>
                          <p className="text-xs text-muted-foreground">{type.duration} minutes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEditBookingType(type)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availability">Availability Schedule</Label>
                <Select defaultValue="business-hours">
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business-hours">Business Hours (9AM-5PM)</SelectItem>
                    <SelectItem value="evenings">Evenings Only</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buffer-time">Buffer Time Between Meetings</Label>
                <Select value={bufferTime} onValueChange={setBufferTime}>
                  <SelectTrigger id="buffer-time">
                    <SelectValue placeholder="Select buffer time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Select defaultValue="auto">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic (Browser Timezone)</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-daily">Maximum Daily Bookings</Label>
                <Select defaultValue="8">
                  <SelectTrigger id="max-daily">
                    <SelectValue placeholder="Select maximum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 bookings</SelectItem>
                    <SelectItem value="8">8 bookings</SelectItem>
                    <SelectItem value="12">12 bookings</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-accept">Auto-Accept Bookings</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically accept bookings without manual approval
                </p>
              </div>
              <Switch 
                id="auto-accept"
                checked={isAutoAccept}
                onCheckedChange={setIsAutoAccept}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="calendar-sync">Sync with External Calendar</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync bookings with your connected calendars
                </p>
              </div>
              <Switch id="calendar-sync" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Send email notifications for new bookings
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>Works with Google Calendar, Outlook, and Apple Calendar</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open("/calendar", "_self")}>
          <CalendarIcon className="h-4 w-4 mr-1" />
          Go to Calendar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalendlyBookingSystem;
