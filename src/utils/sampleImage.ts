export function generateSampleImage(): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const c = document.createElement('canvas')
    c.width = 1200
    c.height = 800
    const ctx = c.getContext('2d')!

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, c.width, c.height)
    grad.addColorStop(0, '#ff6b6b')
    grad.addColorStop(0.25, '#feca57')
    grad.addColorStop(0.5, '#48dbfb')
    grad.addColorStop(0.75, '#ff9ff3')
    grad.addColorStop(1, '#54a0ff')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, c.width, c.height)

    // Circles
    for (let i = 0; i < 30; i++) {
      ctx.beginPath()
      ctx.arc(
        100 + Math.random() * (c.width - 200),
        100 + Math.random() * (c.height - 200),
        10 + Math.random() * 60,
        0, Math.PI * 2
      )
      ctx.fillStyle = `hsla(${Math.random() * 360}, 80%, 50%, 0.6)`
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    for (let x = 0; x <= c.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, c.height)
      ctx.stroke()
    }
    for (let y = 0; y <= c.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(c.width, y)
      ctx.stroke()
    }

    // Text
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 72px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 10
    ctx.fillText('Designstack', c.width / 2, c.height / 2 - 20)
    ctx.shadowBlur = 0
    ctx.font = '28px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText('Image Effects Demo', c.width / 2, c.height / 2 + 50)

    // Fine detail area
    for (let x = 0; x < 200; x++) {
      for (let y = 0; y < 200; y++) {
        const val = (Math.sin(x * 0.1) * Math.cos(y * 0.1) + 1) * 127
        ctx.fillStyle = `rgb(${val},${val},${val})`
        ctx.fillRect(c.width - 220 + x, c.height - 220 + y, 1, 1)
      }
    }

    const img = new Image()
    img.onload = () => resolve(img)
    img.src = c.toDataURL()
  })
}