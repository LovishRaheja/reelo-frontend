interface Props {
  value: number
  label?: string
  sublabel?: string
  accent?: string
}

export default function ProgressBar({ value, label, sublabel, accent = '#111' }: Props) {
  return (
    <div style={{ width: '100%' }}>
      {(label || sublabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {label && <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{label}</span>}
          {sublabel && <span style={{ fontSize: '13px', color: '#888' }}>{sublabel}</span>}
        </div>
      )}
      <div style={{
        height: '6px',
        background: '#ebebeb',
        borderRadius: '99px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(value, 100)}%`,
          background: accent,
          borderRadius: '99px',
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}
