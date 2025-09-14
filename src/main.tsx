// Debug: Check if environment variables are loaded
console.log('Environment Variables:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Loaded' : '❌ Missing',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing',
});

// Check for required environment variables
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  const errorMessage = 'Missing required environment variables. Please check your .env.local file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/checkEnv';

createRoot(document.getElementById("root")!).render(<App />);