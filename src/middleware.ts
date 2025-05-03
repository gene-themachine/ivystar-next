import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// Match any route except the root
const isProtectedRoute = createRouteMatcher([
  '/find-your-mentor(.*)',
  '/settings(.*)',
  '/saved(.*)',
  '/productivity-hub(.*)',
  '/messages(.*)',
  '/events(.*)',
  '/profile(.*)'
]);

// Alternative approach: match any route except the root
// const isPublicRoute = createRouteMatcher(['/']);
// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  
  if (isProtectedRoute(req) && !userId) {
    // Explicitly redirect to the sign-in page
    return NextResponse.redirect(new URL('/sign-up', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};