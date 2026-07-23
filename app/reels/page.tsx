'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { getJobHistory } from '@/lib/api'
import { useUser } from '@/lib/useUser'
import { supabase } from '@/lib/supabase'
import type { JobResponse } from '@/lib/types'
import Footer from '@/components/Footer'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    done:                  { label: 'Ready',      color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
    failed:                { label: 'Failed',      color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
    awaiting_confirmation: { label: 'Review',      color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
    queued:                { label: 'Queued',      color: '#888',    bg: '#1a1a1a' },
    transcribing:          { label: 'Processing',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
    clipping:              { label: 'Processing',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
    analyzing:             { label: 'Processing',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
    downloading:           { label: 'Processing',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  }
  const c = config[status] ?? { label: status, color: '#888', bg: '#1a1a1a' }
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '99px',
      fontSize: '11px', fontWeight: 600,
      color: c.color, background: c.bg,
    }}>
      {c.label}
    </span>
  )
}

export default function ReelsPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push('/auth?next=/reels')
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      try {
        const history = await getJobHistory(session.access_token)
        setJobs(history)
      } catch {
        setError('Failed to load your reels.')
      } finally {
        setLoading(false)
      }
    })
  }, [user, userLoading, router])

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <div style={{ flex: 1, padding: '48px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: '#fff', marginBottom: '4px' }}>
              My Reels
            </h1>
            <p style={{ fontSize: '13px', color: '#444' }}>All your past videos and clips</p>
          </div>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '9px 18px', background: '#7c3aed', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            + New video
          </button>
        </div>

        {loading && (
          <p style={{ fontSize: '14px', color: '#555' }}>Loading your reels…</p>
        )}

        {error && (
          <p style={{ fontSize: '14px', color: '#f87171' }}>{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div style={{
            background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px',
            padding: '60px 24px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '32px', marginBottom: '16px' }}>🎙</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>No reels yet</p>
            <p style={{ fontSize: '13px', color: '#444', marginBottom: '24px' }}>Upload your first video to get started.</p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '10px 24px', background: '#7c3aed', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Upload a video
            </button>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => job.status === 'done' && router.push(`/results/${job.id}`)}
                style={{
                  background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px',
                  padding: '18px 20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  cursor: job.status === 'done' ? 'pointer' : 'default',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { if (job.status === 'done') e.currentTarget.style.borderColor = '#2a2a2a' }}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: '#1a1a1a', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, fontSize: '18px',
                  }}>
                    🎬
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: '14px', fontWeight: 500, color: '#fff',
                      marginBottom: '3px', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {job.episode?.originalFilename ?? 'Untitled video'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#444' }}>
                      {formatDate(job.episode?.createdAt ?? '')}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  {job.status === 'done' && (
                    <span style={{ fontSize: '12px', color: '#555' }}>
                      {job.episode?.clips?.length ?? job.clipCount} clips
                    </span>
                  )}
                  <StatusBadge status={job.status} />
                  {job.status === 'done' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
