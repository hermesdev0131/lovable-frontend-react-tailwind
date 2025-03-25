
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Bell, BarChart2, Filter, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

// Sample data for ratings and reviews
const ratingData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  average: (3.5 + Math.sin(i / 3) + Math.random() * 0.5).toFixed(1),
  volume: Math.floor(30 + Math.random() * 15),
}));

const reviewsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2023-10-05',
    platform: 'Google',
    comment: 'Excellent service! The team was very responsive and helped me find exactly what I needed. Will definitely recommend to others.',
    status: 'published',
    replied: true,
  },
  {
    id: 2,
    name: 'Michael Chang',
    rating: 4,
    date: '2023-10-03',
    platform: 'Yelp',
    comment: 'Great experience overall. The product quality was excellent but delivery took a bit longer than expected.',
    status: 'published',
    replied: false,
  },
  {
    id: 3,
    name: 'David Smith',
    rating: 2,
    date: '2023-10-01',
    platform: 'Facebook',
    comment: 'Disappointing experience. The customer service was not helpful and the product did not meet my expectations.',
    status: 'flagged',
    replied: false,
  },
  {
    id: 4,
    name: 'Emma Wilson',
    rating: 5,
    date: '2023-09-28',
    platform: 'Google',
    comment: 'I had a wonderful experience! The staff was friendly and knowledgeable. The facilities are clean and modern.',
    status: 'published',
    replied: true,
  },
  {
    id: 5,
    name: 'Robert Chen',
    rating: 3,
    date: '2023-09-25',
    platform: 'Google',
    comment: 'Average service. Nothing outstanding but nothing terrible either. Might use again if needed.',
    status: 'published',
    replied: false,
  },
];

// Platform data
const platformData = [
  { name: 'Google', reviews: 45, average: 4.7 },
  { name: 'Yelp', reviews: 23, average: 4.2 },
  { name: 'Facebook', reviews: 18, average: 4.5 },
  { name: 'TripAdvisor', reviews: 12, average: 4.3 },
];

const Reputation = () => {
  const [selectedDate, setSelectedDate] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Calculate summary statistics
  const totalReviews = reviewsData.length;
  const averageRating = (reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
  const positiveReviews = reviewsData.filter(review => review.rating >= 4).length;
  const negativeReviews = reviewsData.filter(review => review.rating <= 2).length;
  const pendingResponses = reviewsData.filter(review => !review.replied).length;

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard refreshed",
        description: "Latest reviews and ratings have been updated",
      });
    }, 1500);
  };

  // Handle responding to a review
  const handleRespond = (reviewId) => {
    toast({
      title: "Response mode activated",
      description: "You can now draft a response to this review",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Reputation Management</h2>
            <p className="text-muted-foreground">Monitor and manage your online reviews and ratings</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRefresh} variant="outline" size="icon" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold flex items-center">
                      {averageRating} <Star className="h-5 w-5 ml-1 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      +0.2 ↑
                    </div>
                  </div>
                  <div className="mt-2">
                    <StarRating rating={Math.floor(parseFloat(averageRating))} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{totalReviews}</div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {ratingData[ratingData.length - 1].volume - ratingData[ratingData.length - 7].volume} new in the last week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{Math.round((positiveReviews / totalReviews) * 100)}%</div>
                    <div className="flex gap-2">
                      <span className="flex items-center text-green-600">
                        <ThumbsUp className="h-4 w-4 mr-1" /> {positiveReviews}
                      </span>
                      <span className="flex items-center text-red-600">
                        <ThumbsDown className="h-4 w-4 mr-1" /> {negativeReviews}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${(positiveReviews / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{pendingResponses}</div>
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Bell className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {pendingResponses === 0 ? "All caught up!" : `${pendingResponses} reviews need attention`}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rating Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Trend</CardTitle>
                <CardDescription>Average rating over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      average: { label: "Average Rating" },
                      volume: { label: "Review Volume" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={ratingData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => {
                            const d = new Date(date);
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                          }}
                        />
                        <YAxis domain={[0, 5]} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="average" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorAvg)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>Reviews by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ChartContainer
                      config={{
                        reviews: { label: "Total Reviews" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={platformData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="reviews" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>Latest feedback from customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewsData.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{review.name}</div>
                            <div className="flex items-center mt-1">
                              <StarRating rating={review.rating} />
                              <span className="text-xs text-muted-foreground ml-2">
                                {formatDate(review.date)}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline">{review.platform}</Badge>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">View All Reviews</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Search reviews..." className="w-[250px]" />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-platforms">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-platforms">All Platforms</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="yelp">Yelp</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewsData.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.name}</TableCell>
                      <TableCell>
                        <StarRating rating={review.rating} />
                      </TableCell>
                      <TableCell>{formatDate(review.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{review.platform}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">{review.comment}</TableCell>
                      <TableCell>
                        {review.status === 'published' ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" /> Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            <AlertCircle className="h-3 w-3 mr-1" /> Flagged
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRespond(review.id)} 
                          disabled={review.replied}
                        >
                          {review.replied ? 'Replied' : 'Respond'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>Common themes from customer reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart2 className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                  <p className="text-muted-foreground">
                    Advanced insights are being processed
                  </p>
                  <Button variant="outline" className="mt-4">
                    Connect Your Yext Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yext Integration</CardTitle>
                <CardDescription>Connect your Yext account to sync data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Yext API Key</Label>
                    <Input id="api-key" placeholder="Enter your Yext API key" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-id">Business ID</Label>
                    <Input id="business-id" placeholder="Enter your Yext business ID" />
                  </div>
                  <Button>
                    Connect to Yext
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get notified about new reviews</p>
                    </div>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Negative Review Alerts</h4>
                      <p className="text-sm text-muted-foreground">Immediate notification for reviews under 3 stars</p>
                    </div>
                    <Switch id="negative-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Report</h4>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your reputation</p>
                    </div>
                    <Switch id="weekly-report" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reputation;
