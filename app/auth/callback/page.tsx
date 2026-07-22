'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getSessionToken } from '@/lib/session'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Claim any anonymous jobs created before sign in
        const sessionToken = getSessionToken()
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ sessionToken }),
          })
        } catch {
          // Non-fatal — jobs just won't be claimed, user can still use the app
        }

        const params = new URLSearchParams(window.location.search)
        const next = params.get('next') || '/'
        router.push(next)
      } else {
        router.push('/auth')
      }
    })
  }, [router])

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '14px', color: '#555' }}>Signing you in…</p>
    </main>
  )
}