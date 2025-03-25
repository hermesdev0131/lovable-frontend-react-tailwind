
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Facebook, Instagram, Linkedin, Twitter, Plus, Clock, Send, Filter, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

// Sample scheduled content data
const initialScheduledContent = [
  {
    id: 1,
    content: "Check out our latest product updates! We've added new features to help you manage your business better.",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: "09:00",
    platforms: ["facebook", "twitter", "linkedin"],
    status: "scheduled",
    media: null
  },
  {
    id: 2,
    content: "We're excited to announce our new partnership with @acmecorp! Stay tuned for exclusive deals.",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: "14:30",
    platforms: ["instagram", "facebook"],
    status: "scheduled",
    media: "product-image.jpg"
  },
  {
    id: 3,
    content: "Thank you to all our customers for the amazing reviews this month! We're committed to providing the best service.",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    time: "10:15",
    platforms: ["facebook", "linkedin", "twitter"],
    status: "published",
    media: null
  }
];

interface ScheduledContent {
  id: number;
  content: string;
  date: Date;
  time: string;
  platforms: string[];
  status: "draft" | "scheduled" | "published" | "failed";
  media: string | null;
}

const platformIcons = {
  facebook: <Facebook className="text-blue-600" />,
  instagram: <Instagram className="text-pink-600" />,
  linkedin: <Linkedin className="text-blue-700" />,
  twitter: <Twitter className="text-blue-400" />,
  google: <Check className="text-green-600" />
};

const ContentScheduling = () => {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>(initialScheduledContent);
  const [newContent, setNewContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleScheduleContent = () => {
    if (!newContent.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to schedule",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform required",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Date required",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    const newPost: ScheduledContent = {
      id: Date.now(),
      content: newContent,
      date: selectedDate,
      time: selectedTime,
      platforms: selectedPlatforms,
      status: "scheduled",
      media: null
    };

    setScheduledContent([...scheduledContent, newPost]);
    
    // Reset form
    setNewContent("");
    setSelectedDate(new Date());
    setSelectedTime("12:00");
    setSelectedPlatforms([]);
    setIsCreating(false);

    toast({
      title: "Content scheduled",
      description: "Your content has been scheduled for posting",
    });
  };

  const handleDelete = (id: number) => {
    setScheduledContent(scheduledContent.filter(content => content.id !== id));
    toast({
      title: "Content removed",
      description: "The scheduled content has been removed",
    });
  };

  const filteredContent = scheduledContent.filter(content => {
    if (filter === "all") return true;
    return content.platforms.includes(filter);
  }).filter(content => {
    if (activeTab === "upcoming") {
      return content.status === "scheduled";
    } else if (activeTab === "published") {
      return content.status === "published";
    }
    return true;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Scheduling</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Post
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Schedule content across multiple platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                placeholder="What would you like to share?"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="time">Select Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Select Platforms</Label>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedPlatforms.includes('facebook') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('facebook')}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant={selectedPlatforms.includes('instagram') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('instagram')}
                  className="flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Button>
                <Button
                  variant={selectedPlatforms.includes('linkedin') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('linkedin')}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button
                  variant={selectedPlatforms.includes('twitter') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('twitter')}
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant={selectedPlatforms.includes('google') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('google')}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Google My Business
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button onClick={handleScheduleContent}>Schedule Post</Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Scheduled Content</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="google">Google My Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {filteredContent.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No upcoming scheduled content
                </div>
              ) : (
                filteredContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <p className="text-sm font-medium">{content.content}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(content.date, "PPP")} at {content.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {content.platforms.map((platform) => (
                              <div key={platform} className="tooltip" data-tip={platform}>
                                {platformIcons[platform]}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(content.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="published" className="space-y-4">
              {filteredContent.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No published content
                </div>
              ) : (
                filteredContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <p className="text-sm font-medium">{content.content}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(content.date, "PPP")} at {content.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {content.platforms.map((platform) => (
                              <div key={platform} className="tooltip" data-tip={platform}>
                                {platformIcons[platform]}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Connections</CardTitle>
          <CardDescription>Manage your social media platform connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Facebook className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="font-medium">Facebook</p>
                <p className="text-sm text-muted-foreground">Connect your Facebook page</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">Connected</span>
              <Switch id="facebook-toggle" defaultChecked />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Instagram className="h-5 w-5 text-pink-600 mr-2" />
              <div>
                <p className="font-medium">Instagram</p>
                <p className="text-sm text-muted-foreground">Connect your Instagram profile</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">Connected</span>
              <Switch id="instagram-toggle" defaultChecked />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Linkedin className="h-5 w-5 text-blue-700 mr-2" />
              <div>
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm text-muted-foreground">Connect your LinkedIn page</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">Connected</span>
              <Switch id="linkedin-toggle" defaultChecked />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Twitter className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <p className="font-medium">Twitter</p>
                <p className="text-sm text-muted-foreground">Connect your Twitter account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-yellow-600">Reconnect needed</span>
              <Switch id="twitter-toggle" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium">Google My Business</p>
                <p className="text-sm text-muted-foreground">Connect your Google My Business account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">Connected</span>
              <Switch id="google-toggle" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ContentScheduling;
