// import arcjet, { createMiddleware, detectBot, shield } from '@arcjet/next';
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
// import { NextResponse } from 'next/server';

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/accounts(.*)','/transactions(.*)'])
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
// //console.log("--->",baseUrl)
// //protecting our website..from BOts,and server attacks
// const aj=arcjet({
//   key:process.env.ARCJET_KEY,
//   rules:[
//     shield({
//       mode:'LIVE'
//     }),
//     detectBot({
//       mode:"LIVE",
//       allow:[//allow krenge jin bots ko
//         "CATEGORY:SEARCH_ENGINE",
//         "GO_HTTP"
//       ]
//     })
//   ]
// })
// const clerk= clerkMiddleware(async (auth, request) => {
//   const {userId}=await auth();
//   if (!userId && isProtectedRoute(request)) {
//     // const {redirectToSignIn}=await auth();
//     // return redirectToSignIn();
//     return NextResponse.redirect(new URL("/sign-in", baseUrl));

//   }
//   // Handle CORS Preflight Requests
//   if (request.method === "OPTIONS") {
//     return new NextResponse(null, {
//       status: 204,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       },
//     });
//   }

//   const response = NextResponse.next();
//   response.headers.set("Access-Control-Allow-Origin", "*");
//   response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   return response;
// });

// export default createMiddleware(aj,clerk)
// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

















// 





























import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/accounts(.*)", // Match your app's naming if applicable
  "/transactions(.*)", // Fixed to plural to match /transactions/createTransaction
]);

// Create Arcjet middleware
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});

// Create Clerk middleware with debugging
const clerk = clerkMiddleware(async (auth, req) => {
  console.log("Middleware - Request URL:", req.url);
  console.log("Middleware - Method:", req.method);

  const { userId } = await auth();
  console.log("Middleware - User ID:", userId);
  console.log("Middleware - Is Protected Route:", isProtectedRoute(req));

  if (!userId && isProtectedRoute(req)) {
    console.log("Middleware - Attempting redirect to sign-in");
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({ returnBackUrl: req.url }); // Explicitly set return URL
  }

  console.log("Middleware - Proceeding to next");
  return NextResponse.next();
});

// Chain middlewares - ArcJet runs first, then Clerk
export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};