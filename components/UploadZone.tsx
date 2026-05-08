'use client'

import { useRef, useState } from 'react'

interface Props {
  onFile: (file: File) => void
  disabled?: boolean
}

export default function UploadZone({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? '#111' : '#d0d0d0'}`,
        borderRadius: '12px',
        padding: '64px 40px',
        textAlign: 'center',
        cursor: disabled ? 'default' : 'pointer',
        background: dragging ? '#f7f7f5' : '#fafaf8',
        transition: 'all 0.2s ease',
        userSelect: 'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,audio/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎙</div>
      <p style={{ fontSize: '17px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
        Drop your podcast episode here
      </p>
      <p style={{ fontSize: '14px', color: '#888' }}>
        MP4, MOV, MP3, WAV — up to 2GB
      </p>
    </div>
  )
}
