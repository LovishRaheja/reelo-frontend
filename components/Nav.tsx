'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'

export default function Nav() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <nav style={{
      padding: '16px 48px',
      borderBottom: '1px solid #1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span
        onClick={() => router.push('/')}
        style={{ fontWeight: 700, fontSize: '18px', color: '#fff', cursor: 'pointer' }}
      >
        Reelo
      </span>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#7c3aed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 600, color: '#fff', flexShrink: 0,
            overflow: 'hidden',
          }}>
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} width={32} height={32} style={{ borderRadius: '50%' }} alt="avatar" />
            ) : (
              user.email?.[0].toUpperCase()
            )}
          </div>
          {/* Name */}
          <span style={{ fontSize: '13px', color: '#888' }}>
            {user.user_metadata?.full_name ?? user.email}
          </span>
          {/* Sign out */}
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            style={{
              padding: '7px 14px', background: 'transparent',
              border: '1px solid #222', borderRadius: '8px',
              fontSize: '12px', cursor: 'pointer', color: '#555',
              fontFamily: 'inherit',
            }}
          >
            Sign out
          </button>
        </div>
      ) : (
        <a href="/auth" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
          Sign in
        </a>
      )}
    </nav>
  )
}