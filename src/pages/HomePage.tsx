import { Link } from 'react-router-dom'
import { EFFECTS } from '../types'

const ICONS: Record<string, string> = {
  stippling: '◈',
  dots: '●',
  patterns: '▓',
  edge: '✧',
  distort: '〜',
  displace: '⊞',
  dithering: '▤',
  bevel: '◆',
  recolor: '🎨',
  scatter: '✦',
  'cellular-automata': '🧬',
  gradients: '🌈',
  crt: '📺',
  ascii: '⎓',
  slide: '⤵',
  stack: '⤴',
}

export default function HomePage() {
  return (
    <div className="page-home">
      <div className="badge">✦ Free · No sign-up · 100% client-side</div>
      <h1>Designstack</h1>
      <p className="tagline">Apply beautiful lo‑fi effects to your images &amp; video</p>

      <div className="effects-grid">
        {EFFECTS.filter(e => e.category === 'effects').map(e => (
          <Link key={e.name} to={`/effects/${e.name}`}>
            <span className="icon">{ICONS[e.name] || '◇'}</span>
            {e.label}
            <span className="cat">Effect</span>
          </Link>
        ))}
        {EFFECTS.filter(e => e.category === 'animate').map(e => (
          <Link key={e.name} to={`/animate/${e.name}`}>
            <span className="icon">{ICONS[e.name] || '◇'}</span>
            {e.label}
            <span className="cat">Animate</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
