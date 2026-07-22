'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import StatusSteps from '@/components/StatusSteps'
import Nav from '@/components/Nav'
import { pollJob } from '@/lib/api'
import { getSessionToken } from '@/lib/session'
import type { JobResponse } from '@/lib/types'

export default function ProcessingPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const [job, setJob] = useState<JobResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) return
    const session = getSessionToken()
    let cancelled = false
    async function poll() {
      try {
        const result = await pollJob(jobId, session)
        if (cancelled) return
        setJob(result)
        if (result.status === 'done') { router.push(`/results/${jobId}`); return }
        if (result.status === 'awaiting_confirmation') { router.push(`/analysis/${jobId}`); return }
        if (result.status === 'failed') { setError(result.errorCode || 'Processing failed'); return }
        setTimeout(poll, 2000)
      } catch { if (!cancelled) setTimeout(poll, 3000) }
    }
    poll()
    return () => { cancelled = true }
  }, [jobId, router])

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: '440px', width: '100%' }} className="fade-up">
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: '#fff', marginBottom: '8px' }}>Processing your video</h1>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '36px' }}>This takes 3–8 minutes. You can close this tab and come back.</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#f87171' }}>{error}</p>
            </div>
          )}

          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>{job?.currentStep ?? 'Queued'}</span>
              <span style={{ fontSize: '13px', color: '#555' }}>{job?.progress ?? 0}%</span>
            </div>
            <ProgressBar value={job?.progress ?? 0} />
            {job?.estimatedSeconds && (
              <p style={{ fontSize: '12px', color: '#333', marginTop: '10px' }}>~{Math.ceil(job.estimatedSeconds / 60)} min remaining</p>
            )}
          </div>

          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px' }}>
            <StatusSteps currentStep={job?.currentStep ?? null} status={job?.status ?? 'queued'} />
          </div>
        </div>
      </div>
    </main>
  )
}