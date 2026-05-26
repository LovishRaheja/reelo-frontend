'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { confirmJob, getJobMetadata } from '@/lib/api'
import { getSessionToken } from '@/lib/session'

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
    const session = getSessionToken()
    getJobMetadata(jobId, session)
      .then(meta => {
        setTopics(meta.topics)
        setContentType(meta.contentType)
        setTone(meta.tone)
        setAudience(meta.audience)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [jobId])

  function addTopic() {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()])
      setNewTopic('')
    }
  }

  function removeTopic(t: string) {
    setTopics(topics.filter(x => x !== t))
  }

  async function handleConfirm() {
    setConfirming(true)
    setError(null)
    try {
      const context = [
        topics.length > 0 ? `Topics: ${topics.join(', ')}` : '',
        `Content type: ${contentType}`,
        `Tone: ${tone}`,
        audience ? `Audience: ${audience}` : '',
        extraContext,
      ].filter(Boolean).join('. ')

      await confirmJob(jobId, context)
      router.push(`/processing/${jobId}`)
    } catch {
      setError('Failed to confirm. Please try again.')
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '15px', color: '#888' }}>Analysing your content…</p>
      </main>
    )
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
            fontSize: '32px',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}>
            We analysed your content
          </h1>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '36px' }}>
            Review what we detected and add anything we missed before generating your clips.
          </p>

          <div style={{
            border: '1px solid #e8e8e8',
            borderRadius: '12px',
            padding: '28px',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>

            {/* Topics */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Topics
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                {topics.map(t => (
                  <span key={t} style={{
                    padding: '6px 12px',
                    background: '#f4f4f2',
                    borderRadius: '99px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {t}
                    <button onClick={() => removeTopic(t)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#999', fontSize: '14px', padding: 0, lineHeight: 1,
                    }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTopic()}
                  placeholder="Add a topic..."
                  style={{
                    flex: 1, padding: '9px 14px', border: '1px solid #e8e8e8',
                    borderRadius: '8px', fontSize: '13px', outline: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                />
                <button onClick={addTopic} style={{
                  padding: '9px 16px', background: '#111', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '13px',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>Add</button>
              </div>
            </div>

            {/* Content type */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Content type
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CONTENT_TYPES.map(t => (
                  <button key={t} onClick={() => setContentType(t)} style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: contentType === t ? '2px solid #111' : '1px solid #e8e8e8',
                    background: contentType === t ? '#111' : '#fff',
                    color: contentType === t ? '#fff' : '#555',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    textTransform: 'capitalize',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Tone
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)} style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: tone === t ? '2px solid #111' : '1px solid #e8e8e8',
                    background: tone === t ? '#111' : '#fff',
                    color: tone === t ? '#fff' : '#555',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    textTransform: 'capitalize',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Target audience
              </label>
              <input
                value={audience}
                onChange={e => setAudience(e.target.value)}
                placeholder="e.g. founders, fitness enthusiasts, developers..."
                style={{
                  width: '100%', padding: '9px 14px', border: '1px solid #e8e8e8',
                  borderRadius: '8px', fontSize: '13px', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Extra context */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Anything else? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#aaa' }}>(optional)</span>
              </label>
              <textarea
                value={extraContext}
                onChange={e => setExtraContext(e.target.value)}
                placeholder="e.g. Focus on the part about fundraising. Ignore the intro."
                rows={3}
                style={{
                  width: '100%', padding: '9px 14px', border: '1px solid #e8e8e8',
                  borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical',
                  fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#c00' }}>{error}</p>
            )}

            <button
              onClick={handleConfirm}
              disabled={confirming}
              style={{
                width: '100%', padding: '14px',
                background: confirming ? '#555' : '#111',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 600, cursor: confirming ? 'default' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {confirming ? 'Starting…' : 'Generate my clips →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
