import { removeBackground } from '@imgly/background-removal'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { EffectName, EffectParams } from '../types'
import { DEFAULT_EFFECT_PARAMS, EFFECTS } from '../types'
import { useCanvas } from '../hooks/useCanvas'
import { generateSampleImage } from '../utils/sampleImage'

const EXPORT_FORMATS = ['png', 'jpeg', 'webp'] as const
type ExportFormat = typeof EXPORT_FORMATS[number]

export default function EffectPage() {
  const { effectName } = useParams<{ effectName: string }>()
  const [params, setParams] = useState<EffectParams>(DEFAULT_EFFECT_PARAMS)
  const [hasImage, setHasImage] = useState(false)
  const [imageKey, setImageKey] = useState(0)
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })
  const [outputSize, setOutputSize] = useState(600)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [toast, setToast] = useState('')
  const [removeBg, setRemoveBg] = useState(false)
  const [isBgRemoving, setIsBgRemoving] = useState(false)
  const [splitPos, setSplitPos] = useState(50)
  const splitRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sampleLoaded = useRef(false)
  const cleanImageRef = useRef<HTMLImageElement | null>(null)

  const {
    sourceCanvasRef, outputCanvasRef, tempCanvasRef,
    loadImage, loadSample, renderEffect, exportCanvas
  } = useCanvas()
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null)

  const activeEffect = (effectName || 'stippling') as EffectName
  const effectConfig = EFFECTS.find(e => e.name === activeEffect)

  const initImage = useCallback(async (img: HTMLImageElement) => {
    cleanImageRef.current = img
    loadSample(img)
    setCanvasSize({ w: img.width, h: img.height })
    setOutputSize(Math.min(img.width, 2000))
    setHasImage(true)
    setImageKey(k => k + 1)
  }, [loadSample])

  const resetParams = () => {
    setParams({ ...DEFAULT_EFFECT_PARAMS })
  }

  const toggleRemoveBg = useCallback(async () => {
    if (removeBg) {
      setRemoveBg(false)
      if (cleanImageRef.current) loadSample(cleanImageRef.current)
      setImageKey(k => k + 1)
      return
    }
    if (!cleanImageRef.current || isBgRemoving) return
    setIsBgRemoving(true)
    setToast('Removing background…')
    const img = cleanImageRef.current
    const imgSrc = img.src.startsWith('data:') ? img.src : img.currentSrc || img.src
    try {
      const blob = await removeBackground(imgSrc)
      const url = URL.createObjectURL(blob)
      const newImg = new Image()
      await new Promise<void>((res, rej) => { newImg.onload = () => res(); newImg.onerror = rej; newImg.src = url })
      loadSample(newImg)
      setCanvasSize({ w: newImg.width, h: newImg.height })
      setOutputSize(Math.min(newImg.width, 2000))
      setImageKey(k => k + 1)
      setRemoveBg(true)
      setToast('')
    } catch {
      setToast('Background removal failed')
      setTimeout(() => setToast(''), 2000)
    }
    setIsBgRemoving(false)
  }, [loadSample, isBgRemoving, removeBg])

  useEffect(() => {
    if (sampleLoaded.current) return
    sampleLoaded.current = true
    generateSampleImage().then(initImage)
  }, [initImage])

  useEffect(() => {
    if (hasImage && sourceCanvasRef.current) {
      renderEffect(activeEffect, params, outputSize)
      // Draw preprocessed source to beforeCanvas at output size for comparison
      const bc = beforeCanvasRef.current
      const sc = sourceCanvasRef.current
      if (bc && sc) {
        const r = sc.width / sc.height
        const w = outputSize, h = Math.round(outputSize / r)
        bc.width = w; bc.height = h
        bc.getContext('2d')!.drawImage(sc, 0, 0, w, h)
      }
    }
  }, [activeEffect, params, hasImage, imageKey, outputSize, renderEffect])

  const startSplitDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); splitRef.current = true
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!splitRef.current) return
      const wrap = outputCanvasRef.current?.parentElement
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
      setSplitPos(Math.max(0, Math.min(100, (x / rect.width) * 100)))
    }
    const up = () => { splitRef.current = false }
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move); window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move); window.removeEventListener('touchend', up)
    }
  }, [outputCanvasRef])

  const handleImageLoad = useCallback(async (file: File) => {
    const img = await loadImage(file)
    initImage(img)
  }, [loadImage, initImage])

  const handleExport = useCallback(() => {
    exportCanvas(exportFormat)
    setToast(`Exported as .${exportFormat}`)
    setTimeout(() => setToast(''), 2000)
  }, [exportCanvas, exportFormat])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImageLoad(file)
  }, [handleImageLoad])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!hasImage) return
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); handleExport()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault(); fileInputRef.current?.click()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasImage, handleExport])

  return (
    <div className="editor">
      <div className="sidebar">
        <Link to="/effects" className="back-link">&larr; All Effects</Link>

        <div className="effect-meta">
          <h2>{effectConfig?.label || activeEffect}</h2>
          <div className="cat">{effectConfig?.category}</div>
        </div>

        <SliderControl label="Canvas Size" value={outputSize} min={100} max={2000} step={1}
          onChange={setOutputSize} />

        <details className="section" open>
          <summary>Image Preprocessing</summary>
          <div className="content">
            <SliderControl label="Blur" value={params.blur} min={0} max={10} step={0.1}
              onChange={v => setParams(p => ({ ...p, blur: v }))} />
            <SliderControl label="Grain" value={params.grain} min={0} max={1} step={0.01}
              onChange={v => setParams(p => ({ ...p, grain: v }))} />
            <SliderControl label="Gamma" value={params.gamma} min={0.1} max={2} step={0.1}
              onChange={v => setParams(p => ({ ...p, gamma: v }))} />
            <SliderControl label="Black Point" value={params.blackPoint} min={0} max={255} step={1}
              onChange={v => setParams(p => ({ ...p, blackPoint: v }))} />
            <SliderControl label="White Point" value={params.whitePoint} min={0} max={255} step={1}
              onChange={v => setParams(p => ({ ...p, whitePoint: v }))} />
            <div className="toggle-box" style={{ marginTop: 10 }}>
              <span className="bracket">[</span>
              <input type="checkbox" checked={removeBg}
                onChange={toggleRemoveBg} disabled={isBgRemoving} />
              <span className="bracket">]</span>
              <span className="label">{isBgRemoving ? 'Processing…' : 'Remove Background'}</span>
            </div>
          </div>
        </details>

        <hr />

        <div className="toggle-box">
          <span className="bracket">[</span>
          <input type="checkbox" checked={params.showEffect}
            onChange={e => setParams(p => ({ ...p, showEffect: e.target.checked }))} />
          <span className="bracket">]</span>
          <span className="label">Show Effect</span>
        </div>

        <h3>{effectConfig?.label || activeEffect} Settings</h3>

        {effectConfig?.params.includes('threshold') && (
          <SliderControl label="Threshold" value={params.threshold} min={0} max={255} step={1}
            onChange={v => setParams(p => ({ ...p, threshold: v }))} />
        )}
        {effectConfig?.params.includes('gridAngle') && (
          <SliderControl label="Grid Angle" value={params.gridAngle} min={-45} max={45} step={1}
            onChange={v => setParams(p => ({ ...p, gridAngle: v }))} />
        )}
        {effectConfig?.params.includes('ySquares') && (
          <SliderControl label="Y Squares" value={params.ySquares} min={2} max={100} step={1}
            onChange={v => setParams(p => ({ ...p, ySquares: v }))} />
        )}
        {effectConfig?.params.includes('xSquares') && (
          <SliderControl label="X Squares" value={params.xSquares} min={2} max={100} step={1}
            onChange={v => setParams(p => ({ ...p, xSquares: v }))} />
        )}
        {effectConfig?.params.includes('maxSquareWidth') && (
          <SliderControl label="Max Width" value={params.maxSquareWidth} min={1} max={50} step={1}
            onChange={v => setParams(p => ({ ...p, maxSquareWidth: v }))} />
        )}

        <button className="btn btn-outline reset-btn" onClick={resetParams}>Reset to defaults</button>

        <div className="shortcut-hint">Ctrl+O upload · Ctrl+S export</div>
      </div>

      <div className="canvas-area"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}>
        {!hasImage ? (
          <div className="canvas-empty" onClick={() => fileInputRef.current?.click()}>
            <div className="icon">⊞</div>
            <p className="hint">Upload media</p>
            <p className="sub">.jpg, .png, or .mp4</p>
            <label className="btn">
              Get started
              <input type="file" accept=".jpg,.jpeg,.png,.mp4"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageLoad(f) }} />
            </label>
          </div>
        ) : (
          <>
            <div className="canvas-size">
              <span>{canvasSize.w}×{canvasSize.h}</span>
              <span style={{ color: 'var(--accent)', opacity: .4 }}>·</span>
              <span>Output {(() => {
                  if (!canvasSize.w) return '0×0'
                  const r = canvasSize.w / canvasSize.h
                  return `${outputSize}×${Math.round(outputSize / r)}`
                })()}</span>
            </div>
            <div className="canvas-wrap">
              <canvas ref={tempCanvasRef} style={{ display: 'none' }} />
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="compare-container" style={{ position: 'relative', maxWidth: '100%', maxHeight: 'calc(100vh - 200px)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <canvas ref={outputCanvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: 'calc(100vh - 200px)' }} />
                  <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
                  {params.showEffect && (
                    <>
                      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - splitPos}% 0 0)`, overflow: 'hidden' }}>
                        <canvas ref={beforeCanvasRef} style={{ display: 'block', maxWidth: 'none', maxHeight: 'none', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', height: '100%' }} />
                      </div>
                      <div onMouseDown={startSplitDrag} onTouchStart={startSplitDrag}
                        style={{ position: 'absolute', top: 0, bottom: 0, left: `${splitPos}%`, width: 3, background: 'var(--accent)', cursor: 'col-resize', zIndex: 10, transform: 'translateX(-50%)', boxShadow: '0 0 12px var(--accent)' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--accent)' }}>
                          <span style={{ color: '#0a0e1a', fontSize: 14, fontWeight: 700 }}>⇔</span>
                        </div>
                      </div>
                      <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '4px 10px', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: 'var(--accent)', border: '1px solid rgba(125,211,252,.3)' }}>ORIGINAL</div>
                      <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '4px 10px', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: 'var(--accent)', border: '1px solid rgba(125,211,252,.3)' }}>EFFECT</div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="export-bar">
              <button className="btn" onClick={handleExport}>Export canvas</button>
              <div className="btn-group">
                {EXPORT_FORMATS.map(f => (
                  <button key={f} className={`grid-btn${exportFormat === f ? ' active' : ''}`}
                    onClick={() => setExportFormat(f)}>.{f}</button>
                ))}
              </div>
              <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>Upload media</button>
            </div>
            <div className="format-hint">.jpg · .png · .mp4</div>
            {toast && <div className="toast">{toast}</div>}
          </>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.mp4"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageLoad(f) }} />
    </div>
  )
}

function SliderControl({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void
}) {
  return (
    <div className="slider-group">
      <div className="label">
        <span>{label}</span>
      </div>
      <div className="slider-control">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))} />
        <input type="number" min={min} max={max} step={step} value={value}
          onChange={e => {
            let v = parseFloat(e.target.value)
            if (isNaN(v)) return
            if (v < min) v = min
            if (v > max) v = max
            onChange(v)
          }} />
      </div>
    </div>
  )
}
