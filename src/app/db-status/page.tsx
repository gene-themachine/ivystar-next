'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DatabaseStatus {
  connected: boolean;
  status: string;
  message: string;
  details?: {
    readyState: number;
    host?: string;
    name?: string;
    models: string[];
  };
  error?: string;
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/db-status');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold">MongoDB Connection Status</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors rounded-md text-sm font-medium"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
              <h3 className="text-lg font-semibold mb-2">Error Checking Status</h3>
              <p>{error}</p>
            </div>
          ) : status ? (
            <div className="space-y-6">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full mr-3 ${status.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xl font-semibold">
                  Status: {status.status}
                </span>
              </div>
              
              <div className={`p-4 rounded-lg ${status.connected ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
                <p className="text-lg">{status.message}</p>
              </div>
              
              {status.details && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold border-b border-gray-800 pb-2">Connection Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Ready State</h4>
                      <p className="text-lg">{status.details.readyState}</p>
                    </div>
                    
                    {status.details.host && (
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Host</h4>
                        <p className="text-lg">{status.details.host}</p>
                      </div>
                    )}
                    
                    {status.details.name && (
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Database Name</h4>
                        <p className="text-lg">{status.details.name}</p>
                      </div>
                    )}
                  </div>
                  
                  {status.details.models && status.details.models.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold border-b border-gray-800 pb-2 mb-4">Registered Models</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {status.details.models.map((model) => (
                          <div key={model} className="bg-blue-900/20 border border-blue-800 rounded-md px-3 py-2">
                            {model}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300">
              <p>No status information available.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-gray-500 text-sm">
        <p>Navigate to <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">/api/db-status</code> to see the raw JSON response</p>
      </div>
    </div>
  );
} 