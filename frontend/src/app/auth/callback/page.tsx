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
        let supabaseAccessToken: string | null = null

        // ── PKCE flow: ?code= in query params (default for @supabase/ssr) ──
        const code = new URLSearchParams(window.location.search).get('code')

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error || !data.session?.access_token) {
            console.error('PKCE code exchange failed:', error)
            router.push('/login')
            return
          }
          supabaseAccessToken = data.session.access_token
        } else {
          // ── Implicit flow: session already in hash / storage ──
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error || !session?.access_token) {
            console.error('No Supabase session found:', error)
            router.push('/login')
            return
          }
          supabaseAccessToken = session.access_token
        }

        // Exchange Supabase token for backend JWT
        const res = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
        })

        if (!res.ok) {
          console.error('Backend /auth/google failed:', res.status, await res.text())
          router.push('/login')
          return
        }

        const { access_token } = await res.json()

        // Persist the backend JWT (cookie + localStorage)
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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}