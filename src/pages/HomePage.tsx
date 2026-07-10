import { Link } from 'react-router-dom'
import { EFFECTS } from '../types'
import { Aurora, ShinyText } from '../reactbits'

const ICONS: Record<string, string> = {
  stippling: '◈',
  dots: '●',
  patterns: '▓',
  edge: '✧',
  distort: '〜',
  displace: '⊞',
  dithering: '▤',
  bevel: '◆',
  recolor: '◐',
  scatter: '✦',
  'cellular-automata': '⊡',
  gradients: '▒',
  crt: '▣',
  ascii: '⎓',
  slide: '⤵',
  stack: '⤴',
}

export default function HomePage() {
  return (
    <div className="page-home">
      <Aurora colorStops={['#0a0e1a', '#7dd3fc', '#0a0e1a']} amplitude={0.3} blend={0.4} speed={0.3} />
      <div className="badge">✦ Free · No sign-up · 100% client-side</div>
      <h1>
        <ShinyText text="Designstack" speed={3} color="#94a3b8" shineColor="#7dd3fc" className="hero-shiny" />
      </h1>
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
