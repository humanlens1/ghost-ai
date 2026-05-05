import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const signIn = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in'
const signUp = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up'

const isPublicRoute = createRouteMatcher([
  `${signIn}(.*)`,
  `${signUp}(.*)`,
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const path = req.nextUrl.pathname

  if (path === '/') {
    return userId
      ? NextResponse.redirect(new URL('/editor', req.url))
      : NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
