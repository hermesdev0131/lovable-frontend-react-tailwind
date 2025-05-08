# CORS Setup for Backend

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the original page. This is a security measure to prevent malicious websites from making unauthorized requests to other websites on behalf of the user.

## CORS Configuration

The backend has been configured to allow cross-origin requests from the frontend. This is done in several ways:

1. **Middleware**: A global middleware that adds CORS headers to all API responses
2. **OPTIONS Handlers**: Each API route has an OPTIONS handler to respond to preflight requests
3. **CORS Helper Functions**: Helper functions to consistently apply CORS headers

## Files Involved

1. **middleware.ts**: Global middleware that adds CORS headers to all API responses
2. **lib/cors.ts**: Helper functions for CORS headers
3. **app/api/auth/login/route.ts**: Example of using CORS helpers in a route
4. **app/api/auth/logout/route.ts**: Another example of using CORS helpers

## How It Works

1. When the browser makes a request to the backend from a different origin (e.g., from `http://localhost:8080` to `http://localhost:3000`), it first sends a preflight request using the OPTIONS method.
2. The OPTIONS handler in the route responds with the appropriate CORS headers, telling the browser that the request is allowed.
3. The browser then makes the actual request (e.g., POST, GET, etc.).
4. The middleware adds CORS headers to the response, allowing the browser to process it.

## Configuration Options

The CORS configuration is controlled by environment variables:

- `FRONTEND_URL`: The URL of the frontend (default: `http://localhost:8080`)

You can change these values in the `.env` file.

## Troubleshooting CORS Issues

If you're still experiencing CORS issues:

1. **Check the Network Tab**: In your browser's developer tools, check the Network tab to see the exact request and response headers.
2. **Verify Environment Variables**: Make sure the `FRONTEND_URL` is set correctly in the `.env` file.
3. **Check for Typos**: Make sure the URL in the frontend matches exactly what's allowed in the backend.
4. **Restart the Server**: Sometimes changes to environment variables require a server restart.

## Common CORS Errors

1. **"Access to fetch at 'X' from origin 'Y' has been blocked by CORS policy"**: This means the server is not responding with the correct CORS headers.
2. **"Response to preflight request doesn't pass access control check"**: This means the OPTIONS request is failing or not returning the correct headers.
3. **"Request header field X is not allowed by Access-Control-Allow-Headers in preflight response"**: This means you're trying to send a header that's not allowed by the CORS configuration.

## Testing CORS

You can test if CORS is working correctly by making a request from the frontend to the backend. If the request succeeds, CORS is configured correctly.