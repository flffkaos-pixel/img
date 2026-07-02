import { Link } from 'react-router-dom'
import { EFFECTS } from '../types'

export default function HomePage() {
  return (
    <div className="page-home">
      <h1>Designstack</h1>
      <p>Select a tool to start editing your image</p>

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
