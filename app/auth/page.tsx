'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signInWithGoogle() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '20px 48px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center' }}>
        <span
          onClick={() => router.push('/')}
          style={{ fontWeight: 700, fontSize: '18px', color: '#fff', cursor: 'pointer' }}
        >
          Reelo
        </span>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: '380px', width: '100%' }} className="fade-up">
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: '#fff', marginBottom: '8px' }}>
            Welcome to Reelo
          </h1>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '36px' }}>
            Sign in to save your clips, track your history, and unlock more uploads.
          </p>

          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#1a1a1a' : '#fff',
                color: '#111', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 35.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C41.4 35.7 44 30.2 44 24c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              {loading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#333' }}>
                By continuing you agree to our{' '}
                <a href="/terms" style={{ color: '#7c3aed', textDecoration: 'none' }}>Terms</a>
                {' '}and{' '}
                <a href="/privacy" style={{ color: '#7c3aed', textDecoration: 'none' }}>Privacy Policy</a>
              </span>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: '#f87171', marginTop: '16px', textAlign: 'center' }}>{error}</p>
          )}

          <p style={{ fontSize: '13px', color: '#333', marginTop: '24px', textAlign: 'center' }}>
            Just want to try it?{' '}
            <span onClick={() => router.push('/')} style={{ color: '#7c3aed', cursor: 'pointer' }}>
              Continue without account
            </span>
          </p>
        </div>
      </div>
    </main>
  )
}
