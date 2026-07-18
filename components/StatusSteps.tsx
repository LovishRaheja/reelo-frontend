const STEPS = [
  { key: 'downloading',  label: 'Downloading',   desc: 'Fetching your episode' },
  { key: 'transcribing', label: 'Transcribing',   desc: 'Listening with Whisper AI' },
  { key: 'analyzing',    label: 'Analysing',      desc: 'Finding the best moments' },
  { key: 'clipping',     label: 'Clipping',       desc: 'Cutting your clips' },
  { key: 'done',         label: 'Done',           desc: 'Your clips are ready' },
]

interface Props { currentStep: string | null; status: string }

export default function StatusSteps({ currentStep, status }: Props) {
  const currentIndex = STEPS.findIndex(s => s.key === (currentStep || status))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {STEPS.map((step, i) => {
        const done = i < currentIndex || status === 'done'
        const active = step.key === currentStep || (status === 'done' && step.key === 'done')
        return (
          <div key={step.key} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', paddingBottom: i < STEPS.length - 1 ? '20px' : '0', position: 'relative' }}>
            {i < STEPS.length - 1 && (
              <div style={{ position: 'absolute', left: '10px', top: '22px', width: '1px', height: 'calc(100% - 6px)', background: done ? '#7c3aed' : '#1a1a1a' }} />
            )}
            <div style={{ width: '21px', height: '21px', borderRadius: '50%', flexShrink: 0, zIndex: 1,
              background: done ? '#7c3aed' : active ? 'transparent' : '#111',
              border: active && !done ? '2px solid #7c3aed' : done ? 'none' : '1px solid #222',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              {active && !done && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1.2s ease-in-out infinite' }} />}
            </div>
            <div style={{ paddingTop: '1px' }}>
              <p style={{ fontSize: '13px', fontWeight: active || done ? 600 : 400, color: active || done ? '#fff' : '#333', margin: 0 }}>{step.label}</p>
              {(active || done) && <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 0' }}>{step.desc}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
