'use client'

export default function HowItWorks() {
  return (
    <div style={{ width: '100%', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            How it works
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '16px' }}>
            One upload.<br /><span style={{ color: '#7c3aed' }}>Endless clips.</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#555', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
            Reelo analyses your video, finds the best moments, and delivers ready-to-post clips in minutes.
          </p>
        </div>

        {/* Main row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '60px',
          marginBottom: '64px',
        }}>

          {/* Left steps */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            {[
              { num: '01', title: 'Upload your video', desc: 'Podcast, stream, YouTube video — up to 1GB, any format.' },
              { num: '02', title: 'AI analyses your content', desc: 'Whisper transcribes every word. Llama 3.1 finds the most engaging moments.' },
              { num: '03', title: 'Review and confirm', desc: 'See what Reelo detected — topics, tone, audience. Add context before clipping.' },
              { num: '04', title: 'Download your clips', desc: 'Get individual clips and a compiled highlight reel, ready to post.' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: i < 3 ? '32px' : '0' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#7c3aed' }}>{step.num}</span>
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{step.title}</p>
                  <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right animated mockup */}
          <div style={{ flex: 1, background: '#111', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '24px' }}>
            {/* Window bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '18px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
              <div style={{ flex: 1, height: '1px', background: '#1a1a1a', marginLeft: '8px' }} />
              <span style={{ fontSize: '10px', color: '#333' }}>reelo — your clips</span>
            </div>

            <style>{`
              @keyframes clipIn {
                from { opacity: 0; transform: translateY(12px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes reelIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .clip-anim { animation: clipIn 0.5s ease forwards; opacity: 0; }
              .clip-anim:nth-child(1) { animation-delay: 0.3s; }
              .clip-anim:nth-child(2) { animation-delay: 0.6s; }
              .clip-anim:nth-child(3) { animation-delay: 0.9s; }
              .clip-anim:nth-child(4) { animation-delay: 1.2s; }
              .clip-anim:nth-child(5) { animation-delay: 1.5s; }
              .clip-anim:nth-child(6) { animation-delay: 1.8s; }
              .reel-anim { animation: reelIn 0.5s ease 2.2s forwards; opacity: 0; }
            `}</style>

            {/* Clips grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { emotion: '🔥 excited', platform: 'TikTok', color: '#ff5080', title: 'Every one of us has potential...' },
                { emotion: '💡 insightful', platform: 'LinkedIn', color: '#4a9fd4', title: 'AI is changing education...' },
                { emotion: '✨ inspiring', platform: 'LinkedIn', color: '#4a9fd4', title: 'Rapid advances in tech...' },
                { emotion: '😂 funny', platform: 'TikTok', color: '#ff5080', title: 'That moment when you...' },
                { emotion: '⚡ controversial', platform: 'Instagram', color: '#e1306c', title: 'Nobody talks about this...' },
                { emotion: '❤️ emotional', platform: 'Instagram', color: '#e1306c', title: 'This changed everything...' },
              ].map((clip, i) => (
                <div key={i} className="clip-anim" style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '56px', background: 'linear-gradient(135deg, #1a1a1a, #111)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '8px', color: '#a78bfa' }}>▶</span>
                    </div>
                    <span style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '8px', padding: '1px 5px', background: `${clip.color}20`, border: `1px solid ${clip.color}40`, borderRadius: '99px', color: clip.color }}>
                      {clip.platform}
                    </span>
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <p style={{ fontSize: '9px', color: '#666', marginBottom: '2px' }}>{clip.emotion}</p>
                    <p style={{ fontSize: '9px', color: '#444', lineHeight: 1.3 }}>{clip.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reel banner */}
            <div className="reel-anim" style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#a78bfa' }}>✨ Highlight reel ready</span>
              <span style={{ fontSize: '10px', color: '#444' }}>9:16 · 42s</span>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            '🎙 Whisper AI transcription',
            '🧠 Llama 3.1 semantic selection',
            '⚡ Energy + semantic scoring',
            '🎬 Highlight reel included',
            '📋 Copy-ready captions',
            '🎯 Platform recommendations',
          ].map(f => (
            <span key={f} style={{ padding: '8px 16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: '99px', fontSize: '12px', color: '#444' }}>
              {f}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}
