import arcjet, { createMiddleware, detectBot, shield } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/accounts(.*)','/transactions(.*)'])
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
//console.log("--->",baseUrl)
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
    return NextResponse.redirect(new URL("/sign-in", baseUrl));

  }
  // Handle CORS Preflight Requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
});

export default createMiddleware(aj,clerk)
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}