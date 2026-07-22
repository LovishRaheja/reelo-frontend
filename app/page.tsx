'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UploadZone from '@/components/UploadZone'
import ProgressBar from '@/components/ProgressBar'
import Nav from '@/components/Nav'
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
      const { uploadUrl, fileKey } = await signUpload(selected.name, selected.size, selected.type || 'video/mp4', session)
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
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>
      <Nav />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: '640px', width: '100%', textAlign: 'center' }} className="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '99px', fontSize: '12px', color: '#888', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }}></span>
            Powered by Whisper AI + Llama 3.1
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '20px', color: '#fff' }}>
            1 long video,<br /><span style={{ color: '#7c3aed' }}>viral clips.</span>
          </h1>

          <p style={{ fontSize: '17px', color: '#666', lineHeight: 1.6, marginBottom: '48px', maxWidth: '480px', margin: '0 auto 48px' }}>
            Upload your podcast, stream, or talk. Get ready-to-post clips for TikTok, Instagram, and LinkedIn in minutes.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>Clips:</span>
            {CLIP_OPTIONS.map(n => (
              <button key={n} onClick={() => setClipCount(n)} style={{
                width: '40px', height: '40px', borderRadius: '8px',
                border: clipCount === n ? '2px solid #7c3aed' : '1px solid #222',
                background: clipCount === n ? 'rgba(124,58,237,0.1)' : '#111',
                color: clipCount === n ? '#a78bfa' : '#555',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>

          {stage === 'idle' && <UploadZone onFile={handleFile} />}

          {stage === 'uploading' && (
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '32px', textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{file?.name}</p>
              <p style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>{(file!.size / 1024 / 1024).toFixed(1)} MB · {clipCount} clips</p>
              <ProgressBar value={uploadProgress} label="Uploading" sublabel={`${uploadProgress}%`} />
            </div>
          )}

          {stage === 'creating' && (
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#666' }}>Starting pipeline…</p>
            </div>
          )}

          {stage === 'error' && (
            <>
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'left' }}>
                <p style={{ fontSize: '13px', color: '#f87171' }}>{error}</p>
              </div>
              <UploadZone onFile={handleFile} />
            </>
          )}

          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            {['No account needed', 'Up to 1GB', 'Free to start'].map(t => (
              <span key={t} style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#7c3aed' }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}