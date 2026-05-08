interface Step {
  key: string
  label: string
  description: string
}

const STEPS: Step[] = [
  { key: 'downloading',  label: 'Downloading',   description: 'Fetching your episode' },
  { key: 'transcribing', label: 'Transcribing',   description: 'Listening with Whisper AI' },
  { key: 'analyzing',    label: 'Analyzing',      description: 'Finding the best moments' },
  { key: 'clipping',     label: 'Clipping',       description: 'Cutting your clips' },
  { key: 'uploading',    label: 'Uploading',      description: 'Saving to cloud' },
  { key: 'done',         label: 'Done',           description: 'Your clips are ready' },
]

interface Props {
  currentStep: string | null
  status: string
}

export default function StatusSteps({ currentStep, status }: Props) {
  const currentIndex = STEPS.findIndex(s => s.key === (currentStep || status))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {STEPS.map((step, i) => {
        const done = i < currentIndex || status === 'done'
        const active = step.key === currentStep || (status === 'done' && step.key === 'done')

        return (
          <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: '24px', position: 'relative' }}>
            {i < STEPS.length - 1 && (
              <div style={{
                position: 'absolute',
                left: '11px',
                top: '24px',
                width: '2px',
                height: 'calc(100% - 8px)',
                background: done ? '#111' : '#e8e8e8',
                transition: 'background 0.4s ease',
              }} />
            )}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: done ? '#111' : active ? '#111' : '#e8e8e8',
              border: active && !done ? '2px solid #111' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.3s ease',
              zIndex: 1,
            }}>
              {done && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {active && !done && (
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', background: 'white',
                  animation: 'pulse 1.2s ease-in-out infinite',
                }} />
              )}
            </div>
            <div style={{ paddingTop: '2px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: active || done ? 600 : 400,
                color: active || done ? '#111' : '#bbb',
                margin: 0,
                transition: 'all 0.3s ease',
              }}>{step.label}</p>
              {(active || done) && (
                <p style={{ fontSize: '13px', color: '#888', margin: '2px 0 0' }}>{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
