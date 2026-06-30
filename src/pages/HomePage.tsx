import { Link } from 'react-router-dom'
import { EFFECTS } from '../types'

export default function HomePage() {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '60px 20px', gap: '12px'
      }}
    >
      <h1 style={{ fontSize: 48, color: 'var(--text-h)', margin: 0, letterSpacing: -1 }}>
        Designstack
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text)', margin: 0 }}>
        Select a tool to start editing your image
      </p>

      <div className="effects-grid">
        {EFFECTS.filter(e => e.category === 'effects').map(e => (
          <Link key={e.name} to={`/effects/${e.name}`}>
            {e.label}
            <span className="cat">Effect</span>
          </Link>
        ))}
        {EFFECTS.filter(e => e.category === 'animate').map(e => (
          <Link key={e.name} to={`/animate/${e.name}`}>
            {e.label}
            <span className="cat">Animate</span>
          </Link>
        ))}
      </div>
    </div>
  )
}