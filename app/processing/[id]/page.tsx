'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import StatusSteps from '@/components/StatusSteps'
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

        if (result.status === 'done') {
          router.push(`/results/${jobId}`)
          return
        }
        if (result.status === 'failed') {
          setError(result.errorCode || 'Processing failed')
          return
        }
        setTimeout(poll, 2000)
      } catch {
        if (!cancelled) {
          setTimeout(poll, 3000)
        }
      }
    }

    poll()
    return () => { cancelled = true }
  }, [jobId, router])

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        padding: '24px 40px',
        borderBottom: '1px solid #ebebeb',
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', letterSpacing: '-0.5px' }}>
          Reelo
        </span>
      </nav>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
      }}>
        <div style={{ maxWidth: '480px', width: '100%' }} className="fade-up">
          <h1 style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: '32px',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}>
            Processing your episode
          </h1>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px' }}>
            This takes 3–8 minutes. You can close this tab and come back.
          </p>

          {error && (
            <div style={{
              border: '1px solid #ffd0d0',
              borderRadius: '12px',
              padding: '20px',
              background: '#fff5f5',
              marginBottom: '24px',
            }}>
              <p style={{ fontSize: '14px', color: '#c00', fontWeight: 600 }}>Processing failed</p>
              <p style={{ fontSize: '13px', color: '#c00', marginTop: '4px' }}>{error}</p>
            </div>
          )}

          <div style={{
            border: '1px solid #e8e8e8',
            borderRadius: '12px',
            padding: '32px',
            background: '#fff',
            marginBottom: '24px',
          }}>
            <ProgressBar
              value={job?.progress ?? 0}
              label={job?.currentStep ? undefined : 'Queued'}
              sublabel={`${job?.progress ?? 0}%`}
            />
            {job?.estimatedSeconds && (
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}>
                ~{Math.ceil(job.estimatedSeconds / 60)} min remaining
              </p>
            )}
          </div>

          <div style={{
            border: '1px solid #e8e8e8',
            borderRadius: '12px',
            padding: '32px',
            background: '#fff',
          }}>
            <StatusSteps
              currentStep={job?.currentStep ?? null}
              status={job?.status ?? 'queued'}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
