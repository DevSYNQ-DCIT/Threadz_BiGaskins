import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function TestConnection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [session, setSession] = useState<any>(null);

  const testConnection = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      // Test 1: Check if we can fetch tables (requires RLS to allow this operation)
      const { data: tablesData, error: tablesError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (tablesError) throw tablesError;
      
      setTables(tablesData.map((t: any) => t.tablename));
      
      // Test 2: Get current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      setSession(currentSession);
      setStatus('success');
      
    } catch (err: any) {
      console.error('Connection test failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Supabase Connection Test</h1>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status === 'idle' ? 'bg-gray-400' : 
              status === 'loading' ? 'bg-yellow-500 animate-pulse' : 
              status === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>Connection Status: {status}</span>
          </div>
          
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              <p className="font-medium">Error:</p>
              <pre className="text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-green-50 rounded-md">
                <h3 className="font-medium text-green-800">✓ Connection successful!</h3>
                <div className="mt-2">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30)}...
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Tables found:</span> {tables.length}
                  </p>
                  {session && (
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Session:</span> {session.user ? 'Active' : 'None'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Available Tables:</h4>
                <ul className="space-y-1">
                  {tables.map((table) => (
                    <li key={table} className="text-sm bg-gray-50 p-2 rounded">
                      {table}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          onClick={testConnection} 
          disabled={status === 'loading'}
          className="w-full mt-4"
        >
          {status === 'loading' ? 'Testing...' : 'Test Connection'}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Environment: {process.env.NODE_ENV}
          </p>
        </div>
      </div>
    </div>
  );
}
