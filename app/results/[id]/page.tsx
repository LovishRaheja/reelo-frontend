'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ClipGrid from '@/components/ClipGrid'
import { pollJob } from '@/lib/api'
import { getSessionToken } from '@/lib/session'
import type { JobResponse } from '@/lib/types'

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<JobResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobId) return
    const session = getSessionToken()
    pollJob(jobId, session)
      .then(setJob)
      .finally(() => setLoading(false))
  }, [jobId])

  const clips = job?.episode?.clips ?? []
  const reelUrl = job?.episode?.reelUrl

  async function downloadAll() {
    for (const clip of clips) {
      const response = await fetch(clip.clipUrl)
      const blob = await response.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `clip_${clip.clipNumber}.mp4`
      a.click()
      URL.revokeObjectURL(a.href)
      await new Promise(r => setTimeout(r, 600))
    }
  }

  async function downloadReel() {
    if (!reelUrl) return
    const response = await fetch(reelUrl)
    const blob = await response.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'highlight_reel.mp4'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        padding: '24px 40px',
        borderBottom: '1px solid #ebebeb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', letterSpacing: '-0.5px' }}>
          Reelo
        </span>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '8px 18px',
            background: 'transparent',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: 500,
            color: '#555',
          }}
        >
          New episode
        </button>
      </nav>

      <div style={{ flex: 1, padding: '48px 40px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        {loading && (
          <p style={{ fontSize: '15px', color: '#888' }}>Loading your clips…</p>
        )}

        {!loading && clips.length === 0 && (
          <p style={{ fontSize: '15px', color: '#888' }}>No clips found for this job.</p>
        )}

        {clips.length > 0 && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
            }} className="fade-up">
              <div>
                <h1 style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: '36px',
                  letterSpacing: '-0.5px',
                  marginBottom: '6px',
                }}>
                  Your clips are ready
                </h1>
                <p style={{ fontSize: '14px', color: '#888' }}>
                  {clips.length} clips from <em>{job?.episode?.originalFilename}</em>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {reelUrl && (
                  <button
                    onClick={downloadReel}
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      color: '#111',
                      border: '1px solid #e8e8e8',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    ✨ Download reel
                  </button>
                )}
                <button
                  onClick={downloadAll}
                  style={{
                    padding: '12px 24px',
                    background: '#111',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Download all
                </button>
              </div>
            </div>

            <ClipGrid clips={clips} />
          </>
        )}
      </div>

      <footer style={{
        padding: '24px 40px',
        borderTop: '1px solid #ebebeb',
        textAlign: 'center',
        fontSize: '13px',
        color: '#bbb',
      }}>
        Clips are stored for 24 hours. Download them before they expire.
      </footer>
    </main>
  )
}
