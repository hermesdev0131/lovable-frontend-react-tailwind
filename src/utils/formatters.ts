
/**
 * Format a number as currency
 */
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a review date with relative time if recent
 */
export const formatReviewDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      // Less than a day ago
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        // Less than an hour ago
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      // Less than a week ago
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      // More than a week ago, use standard date format
      return formatDate(dateString);
    }
  } catch (error) {
    console.error('Error formatting review date:', error);
    return '';
  }
};

/**
 * Get badge variant based on status
 */
export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const statusMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    published: "default",
    draft: "secondary",
    archived: "destructive",
    pending: "outline"
  };
  
  return statusMap[status.toLowerCase()] || "default";
};
