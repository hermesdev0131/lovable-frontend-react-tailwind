import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Bell, BarChart2, Filter, RefreshCw, AlertCircle, CheckCircle, ArrowRight, Upload, Link as LinkIcon } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { YextIntegration, ReviewFilter } from '@/types/website';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  getYextCredentials, 
  storeYextCredentials, 
  clearYextCredentials, 
  testYextConnection, 
  validateYextApiKey, 
  fetchYextReviews, 
  fetchYextRatingData, 
  fetchYextPlatformData, 
  respondToYextReview,
  YextReview,
  YextRatingData,
  YextCredentials
} from '@/services/yext';
import { Textarea } from '@/components/ui/textarea';

const Reputation = () => {
  const [selectedDate, setSelectedDate] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [yextIntegration, setYextIntegration] = useState<YextIntegration>({
    apiKey: '',
    businessId: '',
    lastSynced: null,
    isConnected: false
  });
  const [filters, setFilters] = useState<ReviewFilter>({
    rating: undefined,
    platform: undefined,
    dateRange: '30d',
  });
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedReview, setSelectedReview] = useState<YextReview | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const { toast } = useToast();
  
  const [ratingData, setRatingData] = useState<YextRatingData[]>([]);
  const [reviewsData, setReviewsData] = useState<YextReview[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);

  useEffect(() => {
    const savedCredentials = getYextCredentials();
    
    if (savedCredentials) {
      setYextIntegration({
        apiKey: savedCredentials.apiKey,
        businessId: savedCredentials.businessId,
        lastSynced: localStorage.getItem('yextLastSynced') || null,
        isConnected: true
      });
      
      fetchData(savedCredentials);
    }
  }, []);

  const fetchData = async (credentials: YextCredentials) => {
    setIsLoading(true);
    
    try {
      const reviews = await fetchYextReviews(credentials, filters);
      setReviewsData(reviews);
      
      const ratings = await fetchYextRatingData(credentials, selectedDate);
      setRatingData(ratings);
      
      const platforms = await fetchYextPlatformData(credentials);
      setPlatformData(platforms);
      
      const now = new Date().toISOString();
      localStorage.setItem('yextLastSynced', now);
      setYextIntegration(prev => ({...prev, lastSynced: now}));
      
    } catch (error) {
      console.error("Error fetching Yext data:", error);
      toast({
        title: "Data Fetch Error",
        description: "There was an error retrieving your Yext data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (yextIntegration.isConnected) {
      const credentials = getYextCredentials();
      if (credentials) {
        fetchData(credentials);
      }
    }
  }, [filters, selectedDate]);

  const syncWithYext = async () => {
    const credentials = getYextCredentials();
    if (!credentials) {
      toast({
        title: "Connection Error",
        description: "No Yext credentials found. Please reconnect your account.",
        variant: "destructive"
      });
      return;
    }
    
    setShowSyncDialog(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      await fetchData(credentials);
      
      setSyncProgress(100);
      
      setTimeout(() => {
        setShowSyncDialog(false);
        toast({
          title: "Sync Complete",
          description: "Your Yext data has been successfully synced.",
        });
      }, 500);
    } catch (error) {
      console.error("Yext sync error:", error);
      clearInterval(interval);
      setSyncProgress(0);
      setShowSyncDialog(false);
      
      toast({
        title: "Sync Failed",
        description: "There was an error syncing with Yext.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const StarRating = ({ rating }: { rating: number }) => {
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

  const handleRefresh = () => {
    setIsLoading(true);
    const credentials = getYextCredentials();
    
    if (credentials) {
      fetchData(credentials)
        .then(() => {
          toast({
            title: "Dashboard refreshed",
            description: "Latest reviews and ratings have been updated",
          });
        });
    } else {
      setIsLoading(false);
      toast({
        title: "Connection Error",
        description: "No Yext credentials found. Please connect your account.",
        variant: "destructive"
      });
    }
  };

  const handleRespond = (review: YextReview) => {
    setSelectedReview(review);
    setResponseText('');
    setShowResponseDialog(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !responseText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response.",
        variant: "destructive"
      });
      return;
    }
    
    const credentials = getYextCredentials();
    if (!credentials) {
      toast({
        title: "Connection Error",
        description: "No Yext credentials found. Please reconnect your account.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingResponse(true);
    
    try {
      const success = await respondToYextReview(
        credentials,
        selectedReview.id,
        responseText
      );
      
      if (success) {
        setReviewsData(prevReviews => 
          prevReviews.map(review => 
            review.id === selectedReview.id 
              ? {...review, replied: true, replyText: responseText} 
              : review
          )
        );
        
        setShowResponseDialog(false);
        toast({
          title: "Response Submitted",
          description: "Your response has been posted successfully.",
        });
      } else {
        toast({
          title: "Response Failed",
          description: "There was an error posting your response. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error responding to review:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleConnectYext = async () => {
    if (!yextIntegration.apiKey || !yextIntegration.businessId) {
      toast({
        title: "Missing Information",
        description: "Please enter your Yext API key and Business ID",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateYextApiKey(yextIntegration.apiKey)) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Yext API key",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const credentials = {
        apiKey: yextIntegration.apiKey,
        businessId: yextIntegration.businessId
      };
      
      const isConnected = await testYextConnection(credentials);
      
      if (isConnected) {
        storeYextCredentials(credentials);
        const now = new Date().toISOString();
        localStorage.setItem('yextLastSynced', now);
        
        setYextIntegration(prev => ({
          ...prev,
          lastSynced: now,
          isConnected: true
        }));
        
        await fetchData(credentials);
        
        toast({
          title: "Connection Successful",
          description: "Your Yext account has been connected successfully.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Yext. Please verify your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Yext connection error:", error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    clearYextCredentials();
    localStorage.removeItem('yextLastSynced');
    
    setYextIntegration({
      apiKey: '',
      businessId: '',
      lastSynced: null,
      isConnected: false
    });
    
    setRatingData([]);
    setReviewsData([]);
    setPlatformData([]);
    
    toast({
      title: "Disconnected",
      description: "Your Yext account has been disconnected.",
    });
  };

  const totalReviews = reviewsData.length;
  const averageRating = totalReviews > 0 
    ? (reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";
  const positiveReviews = reviewsData.filter(review => review.rating >= 4).length;
  const negativeReviews = reviewsData.filter(review => review.rating <= 2).length;
  const pendingResponses = reviewsData.filter(review => !review.replied).length;

  const filteredReviews = reviewsData.filter(review => {
    if (filters.rating && review.rating !== filters.rating) return false;
    if (filters.platform && review.platform !== filters.platform) return false;
    if (filters.keyword && !review.comment.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    return true;
  });

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

        {!yextIntegration.isConnected && (
          <Card className="mb-6 border-dashed border-2 bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <LinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Connect your Yext account</h3>
                    <p className="text-sm text-muted-foreground">Sync and manage all your reviews from one place</p>
                  </div>
                </div>
                <Button onClick={() => setActiveTab('settings')} variant="default">
                  Connect Yext <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      No change
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
                    No new reviews this week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0}%</div>
                    <div className="flex gap-2">
                      <span className="flex items-center text-green-600">
                        <ThumbsUp className="h-4 w-4 mr-1" /> {positiveReviews}
                      </span>
                      <span className="flex items-center text-red-600">
                        <ThumbsDown className="h-4 w-4 mr-1" /> {negativeReviews}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0}%` }}
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
                    <div className="p-2 bg-amber-100 rounded-full dark:bg-amber-900/20">
                      <Bell className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {pendingResponses === 0 ? "All caught up!" : `${pendingResponses} reviews need attention`}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rating Trend</CardTitle>
                <CardDescription>Average rating over time</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div style={{ height: "320px", width: "100%", overflow: "hidden" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={ratingData}
                      margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
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
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis domain={[0, 5]} />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="custom-tooltip bg-background border p-2 rounded shadow-md">
                              <p className="label">{`Date: ${payload[0].payload.date}`}</p>
                              <p className="rating">{`Rating: ${payload[0].value}`}</p>
                              <p className="volume">{`Reviews: ${payload[0].payload.volume}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }} />
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
                </div>
              </CardContent>
            </Card>

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
                  {reviewsData.length > 0 ? (
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
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setActiveTab('reviews')}
                      >
                        View All Reviews
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No reviews yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab('settings')}
                      >
                        Connect Review Sources
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div className="w-full md:w-auto">
                <Input 
                  placeholder="Search reviews..." 
                  className="w-full md:w-[300px]" 
                  value={filters.keyword}
                  onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Select 
                  value={filters.rating?.toString() || 'all'} 
                  onValueChange={(value) => setFilters({
                    ...filters, 
                    rating: value === 'all' ? undefined : parseInt(value)
                  })}
                >
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
                <Select 
                  value={filters.platform || 'all-platforms'}
                  onValueChange={(value) => setFilters({
                    ...filters, 
                    platform: value === 'all-platforms' ? undefined : value
                  })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-platforms">All Platforms</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Yelp">Yelp</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setFilters({
                    rating: undefined,
                    platform: undefined,
                    dateRange: '30d',
                    keyword: undefined
                  })}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-background rounded-md border">
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
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
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
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30">
                              <CheckCircle className="h-3 w-3 mr-1" /> Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30">
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No reviews yet. Connect your review sources to get started.
                      </TableCell>
                    </TableRow>
                  )}
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
                {yextIntegration.isConnected ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Most Mentioned Positives</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">No data available</span>
                              <span className="text-sm font-medium">0%</span>
                            </div>
                            <Progress value={0} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Most Mentioned Negatives</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">No data available</span>
                              <span className="text-sm font-medium">0%</span>
                            </div>
                            <Progress value={0} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">No trending topics yet</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Topic Trends Over Time</CardTitle>
                        <CardDescription>How frequently topics are mentioned in reviews</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px] flex items-center justify-center">
                          <p className="text-muted-foreground">Not enough data to generate trends</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart2 className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                    <p className="text-muted-foreground">
                      Connect your Yext account to access advanced sentiment analysis
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab('settings')}>
                      Connect Your Yext Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Yext Integration</CardTitle>
                    <CardDescription>Connect your Yext account to sync data</CardDescription>
                  </div>
                  {yextIntegration.isConnected && (
                    <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Yext API Key</Label>
                    <Input 
                      id="api-key" 
                      placeholder="Enter your Yext API key" 
                      type="password" 
                      value={yextIntegration.apiKey}
                      onChange={(e) => setYextIntegration({...yextIntegration, apiKey: e.target.value})}
                      disabled={yextIntegration.isConnected}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-id">Business ID</Label>
                    <Input 
                      id="business-id" 
                      placeholder="Enter your Yext business ID" 
                      value={yextIntegration.businessId}
                      onChange={(e) => setYextIntegration({...yextIntegration, businessId: e.target.value})}
                      disabled={yextIntegration.isConnected}
                    />
                  </div>
                  {yextIntegration.isConnected ? (
                    <>
                      <div className="flex items-center justify-between text-sm py-2">
                        <span className="text-muted-foreground">Last synced</span>
                        <span>
                          {yextIntegration.lastSynced ? 
                            formatDate(yextIntegration.lastSynced) : 
                            'Never'
                          }
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <Button onClick={syncWithYext} className="flex-1">
                          <Upload className="mr-2 h-4 w-4" />
                          Sync Now
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setYextIntegration({
                            apiKey: '',
                            businessId: '',
                            lastSynced: null,
                            isConnected: false
                          })}
                          className="flex-1"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button onClick={handleConnectYext}>
                      Connect to Yext
                    </Button>
                  )}
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
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Negative Review Alerts</h4>
                      <p className="text-sm text-muted-foreground">Immediate notification for reviews under 3 stars</p>
                    </div>
                    <Switch id="negative-alerts" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Report</h4>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your reputation</p>
                    </div>
                    <Switch id="weekly-report" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mobile Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get alerts on your mobile device</p>
                    </div>
                    <Switch id="mobile-notifications" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Syncing with Yext</DialogTitle>
            <DialogDescription>
              Please wait while we sync your reputation data from Yext
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Progress value={syncProgress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Downloading reviews</span>
              <span>{syncProgress}%</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Write your response to the customer's review
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="py-4">
              <div className="mb-4 p-4 bg-muted rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{selectedReview.authorName}</p>
                    <div className="flex items-center mt-1">
                      <StarRating rating={selectedReview.rating} />
                      <span className="ml-2 text-xs text-muted-foreground">{formatDate(selectedReview.date)}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{selectedReview.platform}</Badge>
                </div>
                <p className="text-sm mt-2">{selectedReview.comment}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea 
                  id="response" 
                  placeholder="Type your response here..." 
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitResponse} 
              disabled={isSubmittingResponse || !responseText.trim()}
            >
              {isSubmittingResponse && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reputation;
