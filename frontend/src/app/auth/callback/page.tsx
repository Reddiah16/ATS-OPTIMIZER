'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Cookies from 'js-cookie'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        Cookies.set('access_token', session.access_token, {
          expires: 1,
          sameSite: 'lax',
          secure: true,
        })
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    })
  }, [router])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Signing you in...</p>
    </div>
  )
}