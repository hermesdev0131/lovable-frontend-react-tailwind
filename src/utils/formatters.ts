
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'published':
      return 'success';
    case 'draft':
      return 'secondary';
    case 'scheduled':
      return 'warning';
    default:
      return 'default';
  }
};
