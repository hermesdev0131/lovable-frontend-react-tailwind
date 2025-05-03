
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  useEffect(() => {
    // Log the error for debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Check for error state passed in location
    if (location.state && location.state.error) {
      setErrorInfo(location.state.error.toString());
    }

    // Check for error in URL params
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      setErrorInfo(decodeURIComponent(errorParam));
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6 rounded-lg border border-border bg-card shadow-sm">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        
        {errorInfo && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-md text-left">
            <p className="font-medium mb-2">Error details:</p>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">
              {errorInfo}
            </pre>
          </div>
        )}
        
        <Button 
          variant="default" 
          className="flex items-center gap-2" 
          onClick={() => window.location.href = "/"}
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
