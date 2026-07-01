import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { EffectName, EffectParams } from '../types'
import { DEFAULT_EFFECT_PARAMS, EFFECTS } from '../types'
import { useCanvas } from '../hooks/useCanvas'
import { generateSampleImage } from '../utils/sampleImage'

export default function EffectPage() {
  const { effectName } = useParams<{ effectName: string }>()
  const [params, setParams] = useState<EffectParams>(DEFAULT_EFFECT_PARAMS)
  const [hasImage, setHasImage] = useState(false)
  const [imageKey, setImageKey] = useState(0)
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sampleLoaded = useRef(false)

  const {
    sourceCanvasRef, outputCanvasRef, tempCanvasRef,
    loadImage, loadSample, renderEffect, exportCanvas
  } = useCanvas()

  const activeEffect = (effectName || 'stippling') as EffectName
  const effectConfig = EFFECTS.find(e => e.name === activeEffect)

  const initImage = useCallback(async (img: HTMLImageElement) => {
    loadSample(img)
    setCanvasSize({ w: img.width, h: img.height })
    setHasImage(true)
    // force re-render effect on new image
    setImageKey(k => k + 1)
  }, [loadSample])

  useEffect(() => {
    if (sampleLoaded.current) return
    sampleLoaded.current = true
    generateSampleImage().then(initImage)
  }, [initImage])

  useEffect(() => {
    if (hasImage && sourceCanvasRef.current) {
      renderEffect(activeEffect, params)
    }
  }, [activeEffect, params, hasImage, imageKey, renderEffect])

  const handleImageLoad = useCallback(async (file: File) => {
    const img = await loadImage(file)
    initImage(img)
  }, [loadImage, initImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImageLoad(file)
  }, [handleImageLoad])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault()
        fileInputRef.current?.click()
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        exportCanvas()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [exportCanvas])

  return (
    <div className="editor">
      <div className="sidebar">
        <Link to="/effects" className="back-link">&larr; All Effects</Link>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, color: 'var(--text-h)', margin: 0 }}>
            {effectConfig?.label || activeEffect}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text)', margin: '4px 0 0' }}>
            {effectConfig?.category}
          </p>
        </div>

        <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-h)' }}>
          Image Preprocessing
        </h3>
        <SliderControl label="Blur" value={params.blur} min={0} max={10} step={0.1}
          onChange={v => setParams(p => ({ ...p, blur: v }))} />
        <SliderControl label="Grain" value={params.grain} min={0} max={50} step={1}
          onChange={v => setParams(p => ({ ...p, grain: v }))} />
        <SliderControl label="Gamma" value={params.gamma} min={0.1} max={3} step={0.1}
          onChange={v => setParams(p => ({ ...p, gamma: v }))} />
        <SliderControl label="Black Point" value={params.blackPoint} min={0} max={255} step={1}
          onChange={v => setParams(p => ({ ...p, blackPoint: v }))} />
        <SliderControl label="White Point" value={params.whitePoint} min={0} max={255} step={1}
          onChange={v => setParams(p => ({ ...p, whitePoint: v }))} />

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
        <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-h)' }}>
          {effectConfig?.label || activeEffect} Settings
        </h3>
        <SliderControl label="Threshold" value={params.threshold} min={0} max={255} step={1}
          onChange={v => setParams(p => ({ ...p, threshold: v }))} />
        <div className="slider-group">
          <label style={{ fontSize: 12, color: 'var(--text)', display: 'block', marginBottom: 4 }}>
            Grid Type
          </label>
          <select value={params.gridType}
            onChange={e => setParams(p => ({ ...p, gridType: e.target.value as 'Regular' | 'Benday' }))}>
            <option value="Regular">Regular</option>
            <option value="Benday">Benday</option>
          </select>
        </div>
        <SliderControl label="Grid Angle" value={params.gridAngle} min={0} max={360} step={1}
          onChange={v => setParams(p => ({ ...p, gridAngle: v }))} />
        <SliderControl label="Y Squares" value={params.ySquares} min={2} max={100} step={1}
          onChange={v => setParams(p => ({ ...p, ySquares: v }))} />
        <SliderControl label="X Squares" value={params.xSquares} min={2} max={100} step={1}
          onChange={v => setParams(p => ({ ...p, xSquares: v }))} />
        <SliderControl label="Min Width" value={params.minSquareWidth} min={1} max={50} step={1}
          onChange={v => setParams(p => ({ ...p, minSquareWidth: v }))} />
        <SliderControl label="Max Width" value={params.maxSquareWidth} min={1} max={50} step={1}
          onChange={v => setParams(p => ({ ...p, maxSquareWidth: v }))} />
      </div>

      <div className="canvas-area"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}>
        {!hasImage ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16
          }}>
            <p style={{ fontSize: 16, color: 'var(--text-h)', margin: 0 }}>Drop an image here</p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0 }}>or use Ctrl+O to open a file</p>
            <label className="upload-btn">
              Open image
              <input type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageLoad(f) }} />
            </label>
          </div>
        ) : (
          <>
            <div className="canvas-size">
              Canvas Size <span style={{ color: 'var(--text-h)' }}>
                {canvasSize.w} x {canvasSize.h}
              </span>
            </div>
            <div className="canvas-wrap">
              <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
              <canvas ref={tempCanvasRef} style={{ display: 'none' }} />
              <canvas ref={outputCanvasRef} />
            </div>
            <div className="export-bar">
              <button className="export-btn" onClick={() => exportCanvas()}>Export canvas</button>
              <button className="export-btn" onClick={() => fileInputRef.current?.click()}>Open image</button>
              <span className="hotkey">Ctrl + S</span>
              <span className="hotkey">Ctrl + O</span>
            </div>
          </>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png"
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
        <span>{typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} />
    </div>
  )
}