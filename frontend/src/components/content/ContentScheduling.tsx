import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/formatters';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

// This is just to make sure we have a formatter function available
// in case it's needed for handling any potentially undefined dates
const safeFormatDate = (dateString?: string | null) => {
  if (!dateString) return '';
  return formatDate(dateString);
};

const ContentScheduling = () => {
  const { contentItems } = useMasterAccount();
  
  // Rest of the component implementation
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Scheduling</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your content scheduling UI */}
        <div>
          {contentItems.length === 0 ? (
            <p className="text-muted-foreground">No content items scheduled yet.</p>
          ) : (
            <ul>
              {contentItems.map(item => (
                <li key={item.id}>
                  {item.title} - {item.scheduledFor ? safeFormatDate(item.scheduledFor) : 'Not scheduled'}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentScheduling;
