
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const BrowserCompatibilityCheck: React.FC = () => {
  const [isCompatible, setIsCompatible] = useState(true);
  const [browserInfo, setBrowserInfo] = useState<string>('');
  
  useEffect(() => {
    const checkBrowserCompatibility = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Get browser information for display
      let browserName = 'Unknown Browser';
      if (userAgent.indexOf('chrome') > -1) browserName = 'Google Chrome';
      else if (userAgent.indexOf('firefox') > -1) browserName = 'Firefox';
      else if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) browserName = 'Safari';
      else if (userAgent.indexOf('edge') > -1 || userAgent.indexOf('edg') > -1) browserName = 'Microsoft Edge';
      else if (userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1) browserName = 'Internet Explorer';
      
      // Set browser info for display
      setBrowserInfo(browserName);
      
      // Check for Internet Explorer
      const isIE = userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1;
      
      // Check for very old browsers that don't support modern JS features
      const isOldBrowser = !window.Promise || !window.fetch;
      
      setIsCompatible(!isIE && !isOldBrowser);
    };
    
    checkBrowserCompatibility();
  }, []);
  
  if (isCompatible) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Browser Compatibility Issue</AlertTitle>
      <AlertDescription>
        Your browser ({browserInfo}) may not be fully compatible with this application. 
        For the best experience, please use a modern browser like Google Chrome, Firefox, Microsoft Edge, or Safari.
      </AlertDescription>
    </Alert>
  );
};

export default BrowserCompatibilityCheck;
