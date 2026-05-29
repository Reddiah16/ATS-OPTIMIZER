'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Cookies from 'js-cookie'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // Exchange the code in the URL for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )

      if (error) {
        console.error('Auth error:', error)
        router.push('/login')
        return
      }

      if (data?.session?.access_token) {
        Cookies.set('access_token', data.session.access_token, {
          expires: 1,
          sameSite: 'lax',
          secure: true,
        })
        router.push('/dashboard')
      } else {
        // Wait a moment for session to be set
        setTimeout(async () => {
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData?.session?.access_token) {
            Cookies.set('access_token', sessionData.session.access_token, {
              expires: 1,
              sameSite: 'lax',
              secure: true,
            })
            router.push('/dashboard')
          } else {
            router.push('/login')
          }
        }, 1000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Signing you in...</p>
    </div>
  )
}