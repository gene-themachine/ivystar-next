import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ivystar.',
  description: 'Your aspirational higher learning platform',
  icons: {
    icon: '/web-logo.png',
    shortcut: '/web-logo.png',
    apple: '/web-logo.png',
  },
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
          {/* Favicon */}
          <link
            rel="icon"
            href="/web-logo.svg"
            type="image/svg+xml"
            sizes="any"
          />
        </head>
        <body className={`${inter.variable} font-sans h-full antialiased`}>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1F2937',
                color: '#F3F4F6',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#ECFDF5',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FEF2F2',
                },
              },
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
