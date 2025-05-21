
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Clock, CalendarIcon, User, Mail, MessageSquare, ArrowRight } from "lucide-react";

interface BookingViewProps {
  bookingType?: {
    id: string;
    name: string;
    duration: number;
  };
  onBookingComplete?: () => void;
}

const BookingView: React.FC<BookingViewProps> = ({ 
  bookingType = { id: 'default', name: 'Consultation', duration: 30 },
  onBookingComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  // Available time slots - would typically be fetched from API based on selected date
  const availableTimeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime) {
        toast({
          title: "Selection Required",
          description: "Please select both a date and time",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!name || !email) {
        toast({
          title: "Information Required",
          description: "Please enter your name and email",
          variant: "destructive"
        });
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }
      
      // Simulate booking completion
      toast({
        title: "Booking Confirmed!",
        description: `Your ${bookingType.name} has been scheduled for ${format(selectedDate!, 'MMMM d')} at ${selectedTime}`,
      });
      
      if (onBookingComplete) {
        onBookingComplete();
      }
      
      setStep(3);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{bookingType.name}</CardTitle>
        <CardDescription className="flex items-center">
          <Clock className="h-4 w-4 mr-1" /> 
          {bookingType.duration} minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select a date</Label>
              <div className="border rounded-md p-2">
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={handleDateSelect} 
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                  className="mx-auto"
                />
              </div>
            </div>
            
            {selectedDate && (
              <div className="space-y-2">
                <Label>Select a time on {format(selectedDate, "MMMM d, yyyy")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.map((time) => (
                    <Button 
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-md mb-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{bookingType.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" /> 
                    {selectedDate && format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep(1)}
                >
                  Change
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="h-4 w-4 mr-1" /> Your name
                </Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" /> Email address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> Additional notes (optional)
                </Label>
                <Textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anything that will help prepare for our meeting"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="p-6">
              <div className="mx-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-medium mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Your {bookingType.name} has been scheduled for {selectedDate && format(selectedDate, "MMMM d")} at {selectedTime}.
              </p>
              
              <div className="bg-muted p-4 rounded-md text-left mb-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{selectedDate && format(selectedDate, "MMMM d, yyyy")} at {selectedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{bookingType.duration} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">{name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{email}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                A calendar invitation has been sent to your email. You can add this event to your calendar by clicking the link in the email.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        {step < 3 && (
          <>
            <Button 
              variant="ghost"
              onClick={() => step > 1 ? setStep(step - 1) : null}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button onClick={handleContinue}>
              {step === 1 ? 'Next' : 'Schedule Event'} 
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
        {step === 3 && (
          <Button className="w-full" onClick={() => window.close()}>
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingView;
