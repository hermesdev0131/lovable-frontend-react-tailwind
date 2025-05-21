import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));



//export default defineConfig({
//  plugins: [react()],
//  optimizeDeps: {
//    exclude: ['@mapbox/node-pre-gyp', 'aws-sdk', 'mock-aws-s3', 'nock'],
//  },
//  build: {
//    rollupOptions: {
//      external: ['@mapbox/node-pre-gyp', 'aws-sdk', 'mock-aws-s3', 'nock'],
//    },
//  },
//});