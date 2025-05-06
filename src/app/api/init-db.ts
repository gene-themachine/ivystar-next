import { globalConnectPromise } from '@/lib/mongodb';

// This directive ensures this code only runs on the server
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * This file ensures that MongoDB connection is established
 * during app initialization rather than waiting for the first request.
 * 
 * As soon as the application loads, the connection process starts.
 * 
 * Import this in any server component or layout to trigger the initialization.
 */

// Re-export the promise for anyone who needs to await it
export default globalConnectPromise; 