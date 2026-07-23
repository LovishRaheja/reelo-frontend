import Nav from '@/components/Nav'

export const metadata = {
  title: 'Terms of Service — Reelo',
  description: 'Terms of Service for Reelo, the AI-powered video clip generator.',
}

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>
      <Nav />

      <div style={{ flex: 1, maxWidth: '760px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
        <p style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Effective date: July 23, 2026
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: '48px' }}>
          Terms of Service
        </h1>

        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using Reelo ("the Service") at tryreelo.vercel.app, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.',
          },
          {
            title: '2. Description of Service',
            body: 'Reelo is an AI-powered video clip generator that processes video content uploaded by users and generates shorter clips suitable for social media. The Service uses third-party AI models for transcription and analysis.',
          },
          {
            title: '3. User Responsibility for Content',
            body: 'You are solely responsible for all content you upload, submit, or process through Reelo. By using the Service you confirm that:\n• You own the content or have explicit permission from the copyright holder to process it\n• Your content does not violate any applicable laws or third-party rights\n• You will not use the Service to process content you do not have rights to\n\nReelo is not responsible for any copyright infringement or legal issues arising from content you process. If you use a URL import feature, you confirm the video is your own original content or you hold the necessary rights.',
          },
          {
            title: '4. Prohibited Uses',
            body: 'You may not use Reelo to:\n• Process content you do not own or have rights to\n• Upload illegal, harmful, or offensive content\n• Attempt to reverse engineer, scrape, or abuse the Service\n• Use the Service for any unlawful purpose',
          },
          {
            title: '5. Intellectual Property',
            body: 'You retain all rights to your original content. By using Reelo you grant us a temporary licence to process your content solely for the purpose of generating clips. We do not store your content beyond 24 hours after processing.',
          },
          {
            title: '6. Data and Privacy',
            body: 'Your uploaded videos are stored temporarily on Cloudflare R2 and deleted within 24 hours of processing. Clip files are also deleted within 24 hours. We collect minimal data necessary to provide the Service. See our Privacy Policy for full details.',
          },
          {
            title: '7. DMCA and Copyright',
            body: 'Reelo respects intellectual property rights. If you believe content processed through Reelo infringes your copyright, contact us at legal@reelo.app with a DMCA notice. We will investigate and respond promptly.',
          },
          {
            title: '8. Disclaimer of Warranties',
            body: 'The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access, accuracy of AI-generated clips, or fitness for a particular purpose.',
          },
          {
            title: '9. Limitation of Liability',
            body: 'To the maximum extent permitted by law, Reelo and its owner shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.',
          },
          {
            title: '10. Changes to Terms',
            body: 'We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.',
          },
          {
            title: '11. Governing Law',
            body: 'These Terms are governed by the laws of the Netherlands. Any disputes shall be resolved in the courts of Amsterdam.',
          },
          {
            title: '12. Contact',
            body: 'For any questions about these Terms, contact us at legal@reelo.app',
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
          <a href="/privacy" style={{ fontSize: '14px', color: '#7c3aed', textDecoration: 'none' }}>
            Privacy Policy →
          </a>
        </div>
      </div>

      <footer style={{ padding: '24px 40px', borderTop: '1px solid #1a1a1a', textAlign: 'center', fontSize: '12px', color: '#333' }}>
        © 2026 Reelo · <a href="/terms" style={{ color: '#555', textDecoration: 'none' }}>Terms</a> · <a href="/privacy" style={{ color: '#555', textDecoration: 'none' }}>Privacy</a>
      </footer>
    </main>
  )
}
