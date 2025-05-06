import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ivystar.',
  description: 'Your aspirational higher learning platform',
}

// Add a JS function to handle chunk load errors
const ChunkErrorHandling = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('error', function(e) {
            // Check if the error is a chunk load error
            if (e && e.message && e.message.includes('ChunkLoadError')) {
              console.log('Handling chunk load error:', e);
              
              // Try to reload the chunk
              const script = document.createElement('script');
              script.src = e.target.src || e.target.href;
              script.async = true;
              script.onload = function() {
                console.log('Successfully reloaded chunk');
                // Optionally refresh the page or UI component
              };
              script.onerror = function() {
                console.error('Failed to reload chunk, refreshing page');
                // If retry fails, we can refresh the page
                window.location.reload();
              };
              document.head.appendChild(script);
              
              // Prevent the error from bubbling up
              e.preventDefault();
              return true;
            }
            return false;
          }, true);
        `,
      }}
    />
  );
};

// Server-side only MongoDB initialization
import './api/init-db';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <head>
          {/* Add the chunk error handling script */}
          <ChunkErrorHandling />
        </head>
        <body className={`${inter.variable} font-sans h-full antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
