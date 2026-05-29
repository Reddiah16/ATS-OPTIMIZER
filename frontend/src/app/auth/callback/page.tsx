'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { setAccessToken } from '@/lib/auth'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export default function AuthCallback() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState<string>('Initializing...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))

        const errorParam = urlParams.get('error') || hashParams.get('error')
        const errorDescParam = urlParams.get('error_description') || hashParams.get('error_description')

        if (errorParam) {
          console.error('Supabase redirect error:', errorParam, errorDescParam)
          setErrorMsg(`Supabase Auth Error: ${errorDescParam || errorParam}`)
          return
        }

        let supabaseAccessToken: string | null = null

        // ── 1. Implicit flow: direct access token extraction from hash ──
        const hashAccessToken = hashParams.get('access_token')

        if (hashAccessToken) {
          setLoadingStep('Accessing your authorization session...')
          supabaseAccessToken = hashAccessToken
        }
        // ── 2. PKCE flow: ?code= in query params ──
        else if (urlParams.get('code')) {
          const code = urlParams.get('code')!
          setLoadingStep('Exchanging authorization code...')
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error || !data.session?.access_token) {
            console.error('PKCE code exchange failed:', error)
            setErrorMsg(error?.message || 'Failed to exchange authorization code for a session.')
            return
          }
          supabaseAccessToken = data.session.access_token
        }
        // ── 3. Fallback: retrieve session from client ──
        else {
          setLoadingStep('Retrieving existing Supabase session...')
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error || !session?.access_token) {
            console.error('No Supabase session found:', error)
            setErrorMsg(error?.message || 'No active authorization session could be found.')
            return
          }
          supabaseAccessToken = session.access_token
        }

        // Exchange Supabase token for backend JWT
        setLoadingStep('Connecting session with our secure backend...')
        const res = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
        })

        if (!res.ok) {
          const text = await res.text()
          console.error('Backend /auth/google failed:', res.status, text)
          setErrorMsg(`Backend connection failed (${res.status}): ${text || 'Please check API configurations.'}`)
          return
        }

        const { access_token } = await res.json()

        // Persist the backend JWT (cookie + localStorage)
        setAccessToken(access_token)

        setLoadingStep('Redirecting to your workspace...')
        router.push('/dashboard')
      } catch (err) {
        console.error('Auth callback error:', err)
        setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred during sign in.')
      }
    }

    handleCallback()
  }, [router])

  if (errorMsg) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'radial-gradient(circle at center, #18181b 0%, #09090b 100%)',
        color: '#f4f4f5',
        fontFamily: 'Inter, sans-serif',
        padding: '24px'
      }}>
        <div style={{
          maxWidth: '440px',
          width: '100%',
          background: 'rgba(39, 39, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(63, 63, 70, 0.4)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            marginBottom: '16px',
            color: '#ef4444'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#f4f4f5' }}>Authentication Failed</h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px', wordBreak: 'break-word' }}>
            {errorMsg}
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'radial-gradient(circle at center, #18181b 0%, #09090b 100%)',
      gap: '16px',
      color: '#f4f4f5',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(99, 102, 241, 0.1)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500 }}>{loadingStep}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}