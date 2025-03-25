import arcjet, { createMiddleware, detectBot, shield } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/accounts(.*)','/transactions(.*)'])
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//protecting our website..from BOts,and server attacks
const aj=arcjet({
  key:process.env.ARCJET_KEY,
  rules:[
    shield({
      mode:'LIVE'
    }),
    detectBot({
      mode:"LIVE",
      allow:[//allow krenge jin bots ko
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP"
      ]
    })
  ]
})
const clerk= clerkMiddleware(async (auth, request) => {
  const {userId}=await auth();
  if (!userId && isProtectedRoute(request)) {
    // const {redirectToSignIn}=await auth();
    // return redirectToSignIn();
    return NextResponse.redirect(`${baseUrl}/sign-in`);

  }
})

export default createMiddleware(aj,clerk)
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}