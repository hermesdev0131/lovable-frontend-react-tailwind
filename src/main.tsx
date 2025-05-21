import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'


createRoot(document.getElementById("root")!).render(<App />);
//// Initialize MSW in development mode
//async function initializeMocks() {
//  if (import.meta.env.DEV) {
//    const { worker } = await import('./mocks/browser');
//    return worker.start({
//      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
//    });
//  }
//  return Promise.resolve();
//}

// Start the app after initializing mocks
//initializeMocks().then(() => {
//  createRoot(document.getElementById("root")!).render(<App />);
//});
