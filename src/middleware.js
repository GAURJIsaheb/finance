import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/accounts(.*)','/transactions(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const {userId}=await auth();
  if (!userId && isProtectedRoute(request)) {
    // const {redirectToSignIn}=await auth();
    // return redirectToSignIn();
    return NextResponse.redirect('http://localhost:3000/sign-in');//do to /sign-in page

  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}