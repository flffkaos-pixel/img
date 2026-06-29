import { useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { EFFECTS } from '../types'
import { useCanvas } from '../hooks/useCanvas'

export default function HomePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    loadImage, setupCanvas, sourceCanvasRef, outputCanvasRef
  } = useCanvas()

  const handleImageLoad = useCallback(async (file: File) => {
    const img = await loadImage(file)
    setupCanvas(img)
    const first = EFFECTS[0].name
    navigate(`/effects/${first}`, { state: { fromUpload: true } })
  }, [loadImage, setupCanvas, navigate])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImageLoad(file)
  }, [handleImageLoad])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageLoad(file)
  }, [handleImageLoad])

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '60px 20px', gap: '12px'
      }}
    >
      <h1 style={{ fontSize: 48, color: 'var(--text-h)', margin: 0, letterSpacing: -1 }}>
        Tooooools
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text)', margin: 0 }}>
        Upload an image → Select and adjust effect → Export
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

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          width: '100%', maxWidth: 500, marginTop: 20,
          padding: '60px 20px', border: '2px dashed var(--border)',
          borderRadius: 12, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 16, cursor: 'pointer', transition: '.2s'
        }}
      >
        <span style={{ fontSize: 13 }}>or drop an image here</span>
        <label
          style={{
            padding: '12px 28px', background: 'var(--accent)', color: '#fff',
            borderRadius: 8, fontSize: 14, cursor: 'pointer', border: 'none'
          }}
        >
          Get started
          <input
            ref={fileInputRef}
            type="file" accept=".jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </label>
        <span style={{ fontSize: 11, color: 'var(--text)' }}>[.jpg, .png, or .mp4]</span>
      </div>

      <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
    </div>
  )
}