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
  const [outputSize, setOutputSize] = useState(600)
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
    setOutputSize(Math.min(img.width, 2000))
    setHasImage(true)
    setImageKey(k => k + 1)
  }, [loadSample])

  useEffect(() => {
    if (sampleLoaded.current) return
    sampleLoaded.current = true
    generateSampleImage().then(initImage)
  }, [initImage])

  useEffect(() => {
    if (hasImage && sourceCanvasRef.current) {
      renderEffect(activeEffect, params, outputSize)
    }
  }, [activeEffect, params, hasImage, imageKey, outputSize, renderEffect])

  const handleImageLoad = useCallback(async (file: File) => {
    const img = await loadImage(file)
    initImage(img)
  }, [loadImage, initImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImageLoad(file)
  }, [handleImageLoad])

  return (
    <div className="editor">
      <div className="sidebar">
        <Link to="/effects" className="back-link">&larr; All Effects</Link>
        <div style={{ marginBottom: 20 }}>
          <h3>{effectConfig?.label || activeEffect}</h3>
          <p style={{ fontSize: 12, color: 'var(--text)', margin: '4px 0 0' }}>
            {effectConfig?.category}
          </p>
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
          </div>
        </details>

        <div className="toggle-box">
          <span className="bracket">[</span>
          <input type="checkbox" checked={params.showEffect}
            onChange={e => setParams(p => ({ ...p, showEffect: e.target.checked }))} />
          <span className="bracket">]</span>
          <span className="label">Show Effect</span>
        </div>

        <h3>{effectConfig?.label || activeEffect} Settings</h3>
        <SliderControl label="Threshold" value={params.threshold} min={0} max={255} step={1}
          onChange={v => setParams(p => ({ ...p, threshold: v }))} />
        <div className="slider-group">
          <div className="label">Grid Type</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className={params.gridType === 'Regular' ? 'grid-btn active' : 'grid-btn'}
              onClick={() => setParams(p => ({ ...p, gridType: 'Regular' }))}>Regular</button>
            <button className={params.gridType === 'Benday' ? 'grid-btn active' : 'grid-btn'}
              onClick={() => setParams(p => ({ ...p, gridType: 'Benday' }))}>Benday</button>
          </div>
        </div>
        <SliderControl label="Grid Angle" value={params.gridAngle} min={-45} max={45} step={1}
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
          <div className="canvas-empty">
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
              <span>Canvas Size <span style={{ color: 'var(--text-h)' }}>
                {canvasSize.w} × {canvasSize.h}
              </span></span>
              <span style={{ color: 'var(--text)' }}>→</span>
              <span style={{ color: 'var(--text-h)' }}>
                {(() => {
                  if (!canvasSize.w) return '0 × 0'
                  const r = canvasSize.w / canvasSize.h
                  const ow = outputSize
                  const oh = Math.round(outputSize / r)
                  return `${ow} × ${oh}`
                })()}
              </span>
            </div>
            <div className="canvas-wrap">
              <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
              <canvas ref={tempCanvasRef} style={{ display: 'none' }} />
              <canvas ref={outputCanvasRef} />
            </div>
            <div className="export-bar">
              <button className="btn" onClick={() => exportCanvas()}>Export canvas</button>
              <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>Upload media</button>
            </div>
            <div className="format-hint">.jpg, .png, or .mp4</div>
          </>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.mp4"
        className="hidden-file"
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
