'use client'

import { useState } from 'react'
import type { ClipResponse } from '@/lib/types'

interface Props {
  clip: ClipResponse
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
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
      const response = await fetch(clip.clipUrl)
      const blob = await response.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `clip_${clip.clipNumber}.mp4`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{
      border: '1px solid #e8e8e8',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff',
      transition: 'box-shadow 0.2s ease',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{
        background: '#f4f4f2',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>
            {clip.clipNumber}
          </span>
        </div>
        <span style={{ fontSize: '13px', color: '#888' }}>{formatDuration(clip.durationMs)}</span>
      </div>

      <div style={{ padding: '20px' }}>
        {clip.title && (
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '8px', lineHeight: 1.4 }}>
            {clip.title}
          </p>
        )}
        {clip.transcript && (
          <p style={{
            fontSize: '13px', color: '#666', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: '16px',
          }}>
            {clip.transcript}
          </p>
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open(clip.clipUrl, '_blank')}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#555',
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            ▶ Play
          </button>
          <button
            onClick={downloadClip}
            disabled={downloading}
            style={{
              flex: 1, padding: '10px', background: downloading ? '#555' : '#111', color: 'white',
              borderRadius: '8px', textAlign: 'center', fontSize: '13px',
              fontWeight: 600, border: 'none', cursor: downloading ? 'default' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {downloading ? 'Downloading...' : 'Download'}
          </button>
          {clip.transcript && (
            <button
              onClick={copyTranscript}
              style={{
                padding: '10px 14px', background: copied ? '#f0f0ee' : 'transparent',
                border: '1px solid #e8e8e8', borderRadius: '8px',
                fontSize: '13px', cursor: 'pointer', color: '#555', fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {copied ? 'Copied!' : 'Copy caption'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
