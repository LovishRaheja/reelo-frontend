'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { confirmJob, getJobMetadata } from '@/lib/api'
import { getSessionToken } from '@/lib/session'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const CONTENT_TYPES = ['podcast', 'interview', 'talk', 'tutorial', 'stream', 'other']
const TONES = ['educational', 'entertaining', 'inspirational', 'controversial', 'conversational']

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topics, setTopics] = useState<string[]>([])
  const [newTopic, setNewTopic] = useState('')
  const [contentType, setContentType] = useState('podcast')
  const [tone, setTone] = useState('educational')
  const [audience, setAudience] = useState('')
  const [extraContext, setExtraContext] = useState('')

  useEffect(() => {
    if (!jobId) return
    getJobMetadata(jobId, getSessionToken())
      .then(meta => { setTopics(meta.topics); setContentType(meta.contentType); setTone(meta.tone); setAudience(meta.audience); setLoading(false) })
      .catch(() => setLoading(false))
  }, [jobId])

  function addTopic() {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) { setTopics([...topics, newTopic.trim()]); setNewTopic('') }
  }

  async function handleConfirm() {
    setConfirming(true); setError(null)
    try {
      const context = [topics.length > 0 ? `Topics: ${topics.join(', ')}` : '', `Content type: ${contentType}`, `Tone: ${tone}`, audience ? `Audience: ${audience}` : '', extraContext].filter(Boolean).join('. ')
      await confirmJob(jobId, context)
      router.push(`/processing/${jobId}`)
    } catch { setError('Failed to confirm.'); setConfirming(false) }
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>Analysing your content…</p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: '520px', width: '100%' }} className="fade-up">
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: '#fff', marginBottom: '6px' }}>We analysed your video</h1>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '32px' }}>Review what we detected and add anything we missed.</p>

          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>Topics</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {topics.map(t => (
                  <span key={t} style={{ padding: '5px 10px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '6px', fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {t}
                    <button onClick={() => setTopics(topics.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: '14px', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTopic()} placeholder="Add a topic…" style={{ flex: 1, padding: '8px 12px', background: '#0d0d0d', border: '1px solid #222', borderRadius: '7px', fontSize: '13px', color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={addTopic} style={{ padding: '8px 14px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '7px', fontSize: '12px', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>Content type</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {CONTENT_TYPES.map(t => (
                  <button key={t} onClick={() => setContentType(t)} style={{ padding: '7px 14px', borderRadius: '7px', border: contentType === t ? '1px solid #7c3aed' : '1px solid #1a1a1a', background: contentType === t ? 'rgba(124,58,237,0.1)' : '#0d0d0d', color: contentType === t ? '#a78bfa' : '#444', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>Tone</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)} style={{ padding: '7px 14px', borderRadius: '7px', border: tone === t ? '1px solid #7c3aed' : '1px solid #1a1a1a', background: tone === t ? 'rgba(124,58,237,0.1)' : '#0d0d0d', color: tone === t ? '#a78bfa' : '#444', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>Target audience</label>
              <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. founders, fitness enthusiasts…" style={{ width: '100%', padding: '8px 12px', background: '#0d0d0d', border: '1px solid #222', borderRadius: '7px', fontSize: '13px', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
                Extra context <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#333' }}>(optional)</span>
              </label>
              <textarea value={extraContext} onChange={e => setExtraContext(e.target.value)} placeholder="e.g. Focus on the fundraising section. Ignore the intro." rows={3} style={{ width: '100%', padding: '8px 12px', background: '#0d0d0d', border: '1px solid #222', borderRadius: '7px', fontSize: '13px', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            {error && <p style={{ fontSize: '12px', color: '#f87171' }}>{error}</p>}

            <button onClick={handleConfirm} disabled={confirming} style={{ width: '100%', padding: '13px', background: confirming ? '#1a1a1a' : '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: confirming ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              {confirming ? 'Starting…' : 'Generate my clips →'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}