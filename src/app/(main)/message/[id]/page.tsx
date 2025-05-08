// Server Component
import dynamic from 'next/dynamic';

// Define the params type as a Promise
type Params = Promise<{ id: string }>;

// Import the client component with dynamic import to ensure proper code-splitting
const MessagePageClient = dynamic(() => import('./client').then(mod => ({ 
  default: mod.MessagePageClient 
})), { ssr: true });

// The page component is a Server Component that can be async
export default async function MessagePage({ params }: { params: Params }) {
  // Await the params before using its properties
  const resolvedParams = await params;
  // Pass the resolved ID to the client component
  return <MessagePageClient id={resolvedParams.id} />;
}
