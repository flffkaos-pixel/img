export default function AboutPage() {
  return (
    <div style={{ padding: '60px 40px', maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, color: 'var(--text-h)', margin: '0 0 20px' }}>About</h1>
      <p style={{ lineHeight: 1.7, fontSize: 15 }}>
        Tooooools is a free online image effects tool created by{' '}
        <a href="https://pivosoki.com" target="_blank" rel="noopener noreferrer">Daniil Sukhovskoy</a>.
        Upload any image and apply various artistic effects including stippling, dot patterns,
        edge detection, dithering, ASCII art, CRT simulation, and more.
      </p>
      <p style={{ lineHeight: 1.7, fontSize: 15 }}>
        Free for personal and commercial use. Attribution is not required, but appreciated.
      </p>
      <p style={{ marginTop: 32 }}>
        <a href="https://effect.app/" target="_blank" rel="noopener noreferrer">
          More effects &rarr;
        </a>
      </p>
    </div>
  )
}