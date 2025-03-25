
import React from 'react';
import { Calendar, Clock, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BookingLinkProps {
  bookingType: {
    id: string;
    name: string;
    duration: number;
  };
  userName: string;
  companyName?: string;
}

const BookingLink: React.FC<BookingLinkProps> = ({ 
  bookingType, 
  userName, 
  companyName = 'CRM Pro' 
}) => {
  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{bookingType.name} with {userName}</CardTitle>
          {companyName && (
            <div className="text-sm text-muted-foreground mt-1">{companyName}</div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <div className="text-sm">{bookingType.duration} minutes</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Your Information</Label>
                <div className="grid gap-2 mt-1">
                  <Input placeholder="Your name" />
                  <Input placeholder="Your email" type="email" />
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Globe className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Select Your Timezone</Label>
                <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Eastern Time (US & Canada)</option>
                  <option>Central Time (US & Canada)</option>
                  <option>Pacific Time (US & Canada)</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-4 gap-1 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu'].map(day => (
              <div key={day} className="text-center">
                <div className="text-xs font-medium">{day}</div>
                <div className="text-xs text-muted-foreground">Jun 10</div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="text-sm justify-start h-auto py-2">
              <span>9:00 AM</span>
            </Button>
            <Button variant="outline" className="text-sm justify-start h-auto py-2">
              <span>9:30 AM</span>
            </Button>
            <Button variant="outline" className="text-sm justify-start h-auto py-2">
              <span>10:00 AM</span>
            </Button>
            <Button variant="outline" className="text-sm justify-start h-auto py-2">
              <span>10:30 AM</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Show More Times
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingLink;
