
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OpportunitiesPanel: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader>
        <CardTitle>Hot Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[150px] flex items-center justify-center text-center">
          <div>
            <p className="text-muted-foreground mb-2">No opportunities</p>
            <p className="text-sm text-muted-foreground">
              Add opportunities to start tracking potential deals
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/opportunities')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Opportunity
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunitiesPanel;
