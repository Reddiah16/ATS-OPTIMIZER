import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    
    // Set access_token cookie so middleware recognizes the session
    if (data?.session?.access_token) {
      const response = NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      response.cookies.set('access_token', data.session.access_token, {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600,
        path: '/',
      })
      return response
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}