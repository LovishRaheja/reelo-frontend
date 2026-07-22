'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ClipGrid from '@/components/ClipGrid'
import Nav from '@/components/Nav'
import { pollJob } from '@/lib/api'
import { getSessionToken } from '@/lib/session'
import { useUser } from '@/lib/useUser'
import type { JobResponse } from '@/lib/types'

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [job, setJob] = useState<JobResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    if (!jobId) return
    pollJob(jobId, getSessionToken()).then(setJob).finally(() => setLoading(false))
  }, [jobId])

  const clips = job?.episode?.clips ?? []
  const reelUrl = job?.episode?.reelUrl

  async function downloadAll() {
    for (const clip of clips) {
      const r = await fetch(clip.clipUrl)
      const blob = await r.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `clip_${clip.clipNumber}.mp4`
      a.click()
      URL.revokeObjectURL(a.href)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  async function downloadReel() {
    if (!reelUrl) return
    const r = await fetch(reelUrl)
    const blob = await r.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'highlight_reel.mp4'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <div style={{ flex: 1, padding: '48px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {loading && <p style={{ fontSize: '14px', color: '#555' }}>Loading…</p>}
        {!loading && clips.length === 0 && <p style={{ fontSize: '14px', color: '#555' }}>No clips found.</p>}

        {clips.length > 0 && (
          <>
            {!user && (
              <div style={{
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>Save your clips</p>
                  <p style={{ fontSize: '13px', color: '#555' }}>Sign in to access your clips anytime and unlock more uploads.</p>
                </div>
                <a href={`/auth?next=/results/${jobId}`} style={{
                  padding: '9px 18px', background: '#7c3aed', color: 'white',
                  borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}>
                  Save my clips →
                </a>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }} className="fade-up">
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: '#fff', marginBottom: '4px' }}>
                  {clips.length} clips ready
                </h1>
                <p style={{ fontSize: '13px', color: '#444' }}>{job?.episode?.originalFilename}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {reelUrl && (
                  <button onClick={downloadReel} style={{ padding: '10px 20px', background: 'transparent', color: '#888', border: '1px solid #222', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ✨ Download reel
                  </button>
                )}
                <button onClick={downloadAll} style={{ padding: '10px 20px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Download all
                </button>
              </div>
            </div>
            <ClipGrid clips={clips} />
          </>
        )}
      </div>

      <footer style={{ padding: '20px 48px', borderTop: '1px solid #1a1a1a', fontSize: '12px', color: '#333', textAlign: 'center' }}>
        Clips stored for 24 hours.
      </footer>
    </main>
  )
}