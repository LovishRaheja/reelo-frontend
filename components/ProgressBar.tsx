interface Props { value: number; label?: string; sublabel?: string }

export default function ProgressBar({ value, label, sublabel }: Props) {
  return (
    <div>
      {(label || sublabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {label && <span style={{ fontSize: '13px', color: '#888' }}>{label}</span>}
          {sublabel && <span style={{ fontSize: '13px', color: '#555' }}>{sublabel}</span>}
        </div>
      )}
      <div style={{ height: '4px', background: '#1a1a1a', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(value, 100)}%`, background: '#7c3aed', borderRadius: '99px', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}
