'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UploadZone from '@/components/UploadZone'
import ProgressBar from '@/components/ProgressBar'
import { signUpload, uploadToR2, createJob } from '@/lib/api'
import { getSessionToken } from '@/lib/session'

type Stage = 'idle' | 'uploading' | 'creating' | 'error'

const CLIP_OPTIONS = [3, 6, 9]

export default function UploadPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [clipCount, setClipCount] = useState(6)

  async function handleFile(selected: File) {
    setFile(selected)
    setError(null)
    setStage('uploading')

    try {
      const session = getSessionToken()

      const { uploadUrl, fileKey } = await signUpload(
        selected.name,
        selected.size,
        selected.type || 'video/mp4',
        session
      )

      await uploadToR2(uploadUrl, selected, setUploadProgress)

      setStage('creating')
      const job = await createJob(fileKey, selected.name, session, clipCount)

      router.push(`/processing/${job.id}`)
    } catch (e: unknown) {
      setStage('error')
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

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
        <div style={{ maxWidth: '560px', width: '100%' }} className="fade-up">
          <h1 style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '16px',
            color: '#111',
          }}>
            Your podcast,<br />
            <em>clip-ready</em> in minutes.
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', lineHeight: 1.6 }}>
            Upload an episode. Get shareable clips for Instagram, TikTok, and LinkedIn — automatically.
          </p>

          {(stage === 'idle' || stage === 'error') && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                How many clips?
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {CLIP_OPTIONS.map(n => (
                  <button
                    key={n}
                    onClick={() => setClipCount(n)}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '8px',
                      border: clipCount === n ? '2px solid #111' : '1px solid #e8e8e8',
                      background: clipCount === n ? '#111' : '#fff',
                      color: clipCount === n ? '#fff' : '#555',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {n}
                  </button>
                ))}
                <span style={{ fontSize: '13px', color: '#aaa' }}>clips</span>
              </div>
            </div>
          )}

          {stage === 'idle' && (
            <UploadZone onFile={handleFile} />
          )}

          {stage === 'uploading' && (
            <div style={{
              border: '1px solid #e8e8e8',
              borderRadius: '12px',
              padding: '32px',
              background: '#fff',
            }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                {file?.name}
              </p>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
                {(file!.size / 1024 / 1024).toFixed(1)} MB · {clipCount} clips requested
              </p>
              <ProgressBar
                value={uploadProgress}
                label="Uploading"
                sublabel={`${uploadProgress}%`}
              />
            </div>
          )}

          {stage === 'creating' && (
            <div style={{
              border: '1px solid #e8e8e8',
              borderRadius: '12px',
              padding: '32px',
              background: '#fff',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '15px', color: '#555' }}>Starting processing pipeline…</p>
            </div>
          )}

          {stage === 'error' && (
            <div style={{
              border: '1px solid #ffd0d0',
              borderRadius: '12px',
              padding: '24px',
              background: '#fff5f5',
              marginBottom: '16px',
            }}>
              <p style={{ fontSize: '14px', color: '#c00', fontWeight: 600, marginBottom: '4px' }}>Upload failed</p>
              <p style={{ fontSize: '13px', color: '#c00' }}>{error}</p>
            </div>
          )}

          {stage === 'error' && (
            <UploadZone onFile={handleFile} />
          )}
        </div>
      </div>

      <footer style={{
        padding: '24px 40px',
        borderTop: '1px solid #ebebeb',
        textAlign: 'center',
        fontSize: '13px',
        color: '#bbb',
      }}>
        No account needed. Your clips are private to your session.
      </footer>
    </main>
  )
}
