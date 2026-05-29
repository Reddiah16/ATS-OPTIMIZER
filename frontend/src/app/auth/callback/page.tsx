'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { setAccessToken } from '@/lib/auth'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the Supabase session (populated from the OAuth redirect hash)
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session?.access_token) {
          console.error('Supabase session error:', error)
          router.push('/login')
          return
        }

        // Exchange the Supabase token for a backend JWT
        const res = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!res.ok) {
          console.error('Backend google auth failed:', await res.text())
          router.push('/login')
          return
        }

        const { access_token } = await res.json()

        // Persist the backend JWT (sets both cookie + localStorage)
        setAccessToken(access_token)

        router.push('/dashboard')
      } catch (err) {
        console.error('Auth callback error:', err)
        router.push('/login')
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