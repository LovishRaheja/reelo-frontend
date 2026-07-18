'use client'

import { useRef, useState } from 'react'

interface Props { onFile: (file: File) => void; disabled?: boolean }

export default function UploadZone({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `1px solid ${dragging ? '#7c3aed' : '#222'}`,
        borderRadius: '16px', padding: '56px 40px', textAlign: 'center',
        cursor: disabled ? 'default' : 'pointer',
        background: dragging ? 'rgba(124,58,237,0.05)' : '#111',
        transition: 'all 0.15s ease',
      }}
    >
      <input ref={inputRef} type="file" accept="video/*,audio/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '22px' }}>⬆</div>
      <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>Drop your video here</p>
      <p style={{ fontSize: '13px', color: '#444', marginBottom: '20px' }}>MP4, MOV, MP3, WAV — up to 1GB</p>
      <div style={{ display: 'inline-block', padding: '10px 28px', background: '#7c3aed', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'white' }}>
        Choose file
      </div>
    </div>
  )
}
