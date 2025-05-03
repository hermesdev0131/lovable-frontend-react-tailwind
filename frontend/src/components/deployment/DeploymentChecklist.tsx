
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IS_PRODUCTION } from '@/config/deploymentConfig';

// Only show this component in development mode
const DeploymentChecklist: React.FC = () => {
  if (IS_PRODUCTION) {
    return null;
  }
  
  return (
    <Card className="mt-4 border-dashed border-yellow-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-600">Deployment Checklist</CardTitle>
        <CardDescription>
          Items to verify before deploying to production. This component only appears in development mode.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox id="check1" />
            <div className="grid gap-1.5">
              <Label htmlFor="check1">Update API endpoints in config</Label>
              <p className="text-sm text-muted-foreground">
                Ensure all API endpoints are pointing to production URLs in the deploymentConfig.ts file.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="check2" />
            <div className="grid gap-1.5">
              <Label htmlFor="check2">Remove test accounts</Label>
              <p className="text-sm text-muted-foreground">
                Ensure no test accounts or dummy data will be visible in production.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="check3" />
            <div className="grid gap-1.5">
              <Label htmlFor="check3">Check mobile responsiveness</Label>
              <p className="text-sm text-muted-foreground">
                Test on various screen sizes to ensure proper responsiveness.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="check4" />
            <div className="grid gap-1.5">
              <Label htmlFor="check4">Test in all target browsers</Label>
              <p className="text-sm text-muted-foreground">
                Verify the application works in Chrome, Firefox, Safari, and Edge.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="check5" />
            <div className="grid gap-1.5">
              <Label htmlFor="check5">Enable analytics</Label>
              <p className="text-sm text-muted-foreground">
                Set analyticsEnabled to true in the production configuration.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentChecklist;
