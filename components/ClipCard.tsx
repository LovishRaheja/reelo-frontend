'use client'

import { useState } from 'react'
import type { ClipResponse } from '@/lib/types'

interface Props { clip: ClipResponse }

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const EMOTION_EMOJI: Record<string, string> = {
  excited: '🔥', insightful: '💡', funny: '😂', emotional: '❤️', controversial: '⚡', inspiring: '✨',
}

const PLATFORM_COLOR: Record<string, string> = {
  linkedin: '#0a66c2', tiktok: '#ff0050', instagram: '#e1306c', youtube_shorts: '#ff0000',
}

const PLATFORM_LABEL: Record<string, string> = {
  linkedin: 'LinkedIn', tiktok: 'TikTok', instagram: 'Instagram', youtube_shorts: 'YT Shorts',
}

export default function ClipCard({ clip }: Props) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function copyTranscript() {
    if (!clip.transcript) return
    await navigator.clipboard.writeText(clip.transcript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function downloadClip() {
    setDownloading(true)
    try {
      const r = await fetch(clip.clipUrl)
      const blob = await r.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `clip_${clip.clipNumber}.mp4`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally { setDownloading(false) }
  }

  return (
    <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
    >
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #161616', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {clip.clipNumber}
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {clip.emotion && (
              <span style={{ padding: '2px 8px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '99px', fontSize: '11px', color: '#888' }}>
                {EMOTION_EMOJI[clip.emotion] ?? '🎯'} {clip.emotion}
              </span>
            )}
            {clip.platform && (
              <span style={{ padding: '2px 8px', background: `${PLATFORM_COLOR[clip.platform] ?? '#7c3aed'}15`, border: `1px solid ${PLATFORM_COLOR[clip.platform] ?? '#7c3aed'}30`, borderRadius: '99px', fontSize: '11px', color: PLATFORM_COLOR[clip.platform] ?? '#a78bfa' }}>
                {PLATFORM_LABEL[clip.platform] ?? clip.platform}
              </span>
            )}
          </div>
        </div>
        <span style={{ fontSize: '11px', color: '#333' }}>{formatDuration(clip.durationMs)}</span>
      </div>

      <div style={{ padding: '16px' }}>
        {clip.title && <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '6px', lineHeight: 1.4 }}>{clip.title}</p>}
        {clip.transcript && (
          <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
            {clip.transcript}
          </p>
        )}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => window.open(clip.clipUrl, '_blank')} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', color: '#555', fontFamily: 'inherit' }}>
            ▶ Play
          </button>
          <button onClick={downloadClip} disabled={downloading} style={{ flex: 1, padding: '8px', background: downloading ? '#1a1a1a' : '#7c3aed', color: 'white', borderRadius: '7px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: downloading ? 'default' : 'pointer', fontFamily: 'inherit' }}>
            {downloading ? 'Downloading…' : 'Download'}
          </button>
          {clip.transcript && (
            <button onClick={copyTranscript} style={{ padding: '8px 10px', background: copied ? '#1a1a1a' : 'transparent', border: '1px solid #1a1a1a', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', color: copied ? '#7c3aed' : '#555', fontFamily: 'inherit' }}>
              {copied ? '✓' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
