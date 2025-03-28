import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Check, Copy, ExternalLink, Loader2, RefreshCw, Search, Star, StarHalf, Trash2, X } from "lucide-react";
import {
  YextCredentials,
  YextReview,
  YextRatingData,
  fetchYextReviews,
  fetchYextRatingData,
  fetchYextPlatformData,
  respondToYextReview,
  getYextCredentials
} from '@/services/yext';
import { useToast } from "@/hooks/use-toast";
import { ReviewFilter } from '@/types/website';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

const initialFilters: ReviewFilter = {
  rating: undefined,
  platform: undefined,
  dateRange: '30d',
  keyword: undefined
};

const PLATFORMS = [
  'google',
  'facebook',
  'yelp',
  'tripadvisor',
  'trustpilot'
];

const RatingBreakdown = ({ reviews }: { reviews: YextReview[] }) => {
  const totalReviews = reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0]; // Count of 1 to 5-star reviews
  
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Breakdown</CardTitle>
        <CardDescription>Distribution of ratings across all reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ratingCounts.map((count, index) => {
            const rating = index + 1;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{rating} Star</span>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span>{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewsList = ({ reviews, onSelectReview }: { reviews: YextReview[], onSelectReview: (review: YextReview) => void }) => {
  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review.id} className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                <CardTitle className="text-sm">{review.authorName}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {review.platform} - {new Date(review.date).toLocaleDateString()}
                </CardDescription>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                      <path d="M12 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" transform="translate(0 6)" />
                      <path d="M12 25.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" transform="translate(0 -6)" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSelectReview(review)}>
                    Respond to Review
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    View Original <ExternalLink className="h-3 w-3 ml-1" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    Report Review <Trash2 className="h-3 w-3 ml-1" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{review.comment}</p>
              {review.replied && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-xs font-medium">You Replied:</p>
                  <p className="text-sm">{review.replyText}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Alert>
          <AlertDescription>No reviews found with the current filters.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const RatingChart = ({ ratingData }: { ratingData: YextRatingData[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Over Time</CardTitle>
        <CardDescription>Average rating and review volume over the past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          {/* Placeholder for chart */}
          <Alert>
            <AlertDescription>
              Chart will be rendered here.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

const PlatformDistribution = ({ platformData }: { platformData: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
        <CardDescription>Distribution of reviews across different platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {platformData.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between">
              <span>{platform.name}</span>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{platform.average.toFixed(1)}</span>
                <Badge variant="secondary">{platform.reviews} Reviews</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const Reputation = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<YextReview[]>([]);
  const [ratingData, setRatingData] = useState<YextRatingData[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ReviewFilter>(initialFilters);
  const [selectedReview, setSelectedReview] = useState<YextReview | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    
    const credentials = getYextCredentials();
    if (!credentials) {
      toast({
        title: "Error",
        description: "Yext credentials not found. Please connect your account in settings.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const fetchedReviews = await fetchYextReviews(credentials, filters);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);
  
  const fetchRatingData = useCallback(async () => {
    const credentials = getYextCredentials();
    if (!credentials) return;
    
    try {
      const fetchedRatingData = await fetchYextRatingData(credentials, filters.dateRange);
      setRatingData(fetchedRatingData);
    } catch (error) {
      console.error("Error fetching rating data:", error);
    }
  }, [filters.dateRange]);
  
  const fetchPlatformData = useCallback(async () => {
    const credentials = getYextCredentials();
    if (!credentials) return;
    
    try {
      const fetchedPlatformData = await fetchYextPlatformData(credentials);
      setPlatformData(fetchedPlatformData);
    } catch (error) {
      console.error("Error fetching platform data:", error);
    }
  }, []);
  
  useEffect(() => {
    fetchReviews();
    fetchRatingData();
    fetchPlatformData();
  }, [fetchReviews, fetchRatingData, fetchPlatformData]);
  
  const handleFilterChange = (newFilters: Partial<ReviewFilter>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    
    if (range?.from && range?.to) {
      const startDate = format(range.from, 'yyyy-MM-dd');
      const endDate = format(range.to, 'yyyy-MM-dd');
      
      // Calculate the difference in days between the start and end dates
      const diffInMs = new Date(endDate).getTime() - new Date(startDate).getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 3600 * 24));
      
      let dateRangeString = '';
      if (diffInDays <= 7) {
        dateRangeString = '7d';
      } else if (diffInDays <= 30) {
        dateRangeString = '30d';
      } else if (diffInDays <= 90) {
        dateRangeString = '90d';
      } else {
        dateRangeString = '1y';
      }
      
      handleFilterChange({ dateRange: dateRangeString });
    }
  };
  
  const handleRatingFilter = (rating: number | undefined) => {
    handleFilterChange({ rating });
  };
  
  const handlePlatformFilter = (platform: string | undefined) => {
    handleFilterChange({ platform });
  };
  
  const handleSearch = (keyword: string) => {
    handleFilterChange({ keyword });
  };

  const handleRespondToReview = async (reviewId: string) => {
    if (!responseText.trim()) return;
    
    setIsSubmitting(true);
    
    const credentials = getYextCredentials();
    if (!credentials) {
      toast({
        title: "Error",
        description: "Yext credentials not found. Please reconnect your account.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const success = await respondToYextReview(credentials, reviewId, responseText);
      
      if (success) {
        toast({
          title: "Response Sent",
          description: "Your response has been submitted successfully."
        });
        
        // Refresh reviews to show the new response
        fetchReviews();
        
        // Clear the response text and selected review
        setResponseText("");
        setSelectedReview(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit your response. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error responding to review:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your response.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reputation Management</h2>
          <p className="text-muted-foreground">Monitor and respond to reviews from various platforms</p>
        </div>
        <Button className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sync Reviews
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Filter Reviews</CardTitle>
            <CardDescription>Apply filters to narrow down the reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Reviews</Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Enter keyword..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Search className="absolute top-2.5 right-3 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <Button
                    key={rating}
                    variant={filters.rating === rating ? "default" : "outline"}
                    onClick={() => handleRatingFilter(filters.rating === rating ? undefined : rating)}
                  >
                    {rating} <Star className="h-4 w-4 ml-1" />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Platform</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filters.platform || "Select platform"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 h-4 w-4"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select a platform</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {PLATFORMS.map(platform => (
                    <DropdownMenuItem key={platform} onClick={() => handlePlatformFilter(platform)}>
                      {platform}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handlePlatformFilter(undefined)}>
                    Clear Platform
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`
                      ) : (
                        format(date.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                    pagedNavigation
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
        
        <RatingChart ratingData={ratingData} />
        <PlatformDistribution platformData={platformData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewsList reviews={reviews} onSelectReview={setSelectedReview} />
        
        <Card className="glass-card hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
            <CardDescription>View and respond to selected review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedReview ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {[...Array(selectedReview.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500" />
                    ))}
                    {[...Array(5 - selectedReview.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                  <p className="text-sm font-medium">{selectedReview.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedReview.platform} - {new Date(selectedReview.date).toLocaleDateString()}
                  </p>
                  <p>{selectedReview.comment}</p>
                </div>
                
                {selectedReview && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Response to {selectedReview.authorName}</h3>
                    <Textarea
                      placeholder="Write your response..."
                      className="min-h-[100px]"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button onClick={() => handleRespondToReview(selectedReview.id)} disabled={!responseText.trim() || isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Send Response
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Alert>
                <AlertDescription>Select a review to view details and respond.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reputation;
