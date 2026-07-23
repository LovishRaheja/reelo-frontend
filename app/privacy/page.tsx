import Nav from '@/components/Nav'

export const metadata = {
  title: 'Privacy Policy — Reelo',
  description: 'Privacy Policy for Reelo, the AI-powered video clip generator.',
}

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>
      <Nav />

      <div style={{ flex: 1, maxWidth: '760px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
        <p style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Effective date: July 23, 2026
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: '48px' }}>
          Privacy Policy
        </h1>

        {[
          {
            title: '1. Who we are',
            body: 'Reelo is operated by Lovish Raheja, based in Amsterdam, Netherlands. You can contact us at legal@reelo.app.',
          },
          {
            title: '2. What data we collect',
            body: 'If you use Reelo without an account:\n• A randomly generated session token stored in your browser (localStorage)\n• Your uploaded video file (temporarily, deleted within 24 hours)\n• The generated clips (temporarily, deleted within 24 hours)\n\nIf you sign in with Google:\n• Your name and email address from your Google account\n• Your Google profile picture\n• A unique user ID linked to your jobs and clip history',
          },
          {
            title: '3. How we use your data',
            body: '• To process your video and generate clips\n• To show you your clip history (signed-in users only)\n• To enforce usage limits per plan\n• We never sell your data to third parties\n• We never use your content to train AI models',
          },
          {
            title: '4. Third-party services',
            body: 'Reelo uses the following third-party services:\n• Cloudflare R2 — temporary video and clip storage (EU region)\n• Cloudflare Workers AI — Whisper transcription and Llama 3.1 analysis\n• Supabase — database and authentication (EU region)\n• Google OAuth — sign in with Google\n• Railway — backend hosting (EU region)\n• Vercel — frontend hosting',
          },
          {
            title: '5. Data retention',
            body: '• Uploaded videos: deleted within 24 hours of processing\n• Generated clips: deleted within 24 hours of generation\n• Account data (email, name): retained until you delete your account\n• Job history: retained until you delete your account',
          },
          {
            title: '6. Your rights (GDPR)',
            body: 'As a user in the EU you have the right to:\n• Access the data we hold about you\n• Request deletion of your data\n• Request a copy of your data\n• Withdraw consent at any time\n\nTo exercise any of these rights contact us at legal@reelo.app.',
          },
          {
            title: '7. Cookies',
            body: 'Reelo does not use tracking cookies. We use localStorage to store your session token for anonymous usage. Signed-in users have a session cookie managed by Supabase Auth.',
          },
          {
            title: '8. Children',
            body: 'Reelo is not intended for users under the age of 16. We do not knowingly collect data from children.',
          },
          {
            title: '9. Changes to this Policy',
            body: 'We may update this Privacy Policy at any time. We will notify signed-in users of significant changes by email.',
          },
          {
            title: '10. Contact',
            body: 'For any privacy questions or GDPR requests, contact us at legal@reelo.app',
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
              {section.title}
            </h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {section.body}
            </p>
          </div>
        ))}

        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid #1a1a1a' }}>
          <a href="/terms" style={{ fontSize: '14px', color: '#7c3aed', textDecoration: 'none' }}>
            Terms of Service →
          </a>
        </div>
      </div>

      <footer style={{ padding: '24px 40px', borderTop: '1px solid #1a1a1a', textAlign: 'center', fontSize: '12px', color: '#333' }}>
        © 2026 Reelo · <a href="/terms" style={{ color: '#555', textDecoration: 'none' }}>Terms</a> · <a href="/privacy" style={{ color: '#555', textDecoration: 'none' }}>Privacy</a>
      </footer>
    </main>
  )
}
