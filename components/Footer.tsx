export default function Footer() {
  return (
    <footer style={{
      padding: '20px 48px',
      borderTop: '1px solid #1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <span style={{ fontSize: '12px', color: '#333' }}>© 2026 Reelo</span>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="/terms" style={{ fontSize: '12px', color: '#555', textDecoration: 'none' }}>Terms</a>
        <a href="/privacy" style={{ fontSize: '12px', color: '#555', textDecoration: 'none' }}>Privacy</a>
        <a href="mailto:legal@reelo.app" style={{ fontSize: '12px', color: '#555', textDecoration: 'none' }}>Contact</a>
      </div>
    </footer>
  )
}