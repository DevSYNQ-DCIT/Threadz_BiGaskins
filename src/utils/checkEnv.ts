// This is a utility to check if environment variables are loaded correctly
export function checkEnv() {
  // Only log in development
  if (import.meta.env.DEV) {
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

    if (missingVars.length > 0) {
      console.warn('ℹ️ Environment variables not found, using hardcoded values');
      console.log('If you want to use environment variables, please create a .env.local file');
      return false;
    }

    console.log('✅ Environment variables are properly set!');
    return true;
  }
  return true;
}

// Run the check when this module is imported
checkEnv();
