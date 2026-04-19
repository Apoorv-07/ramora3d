import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TOTAL = 240
const pad = (n) => String(n).padStart(3, '0')
const src = (n) => `/frames/ezgif-frame-${pad(n)}.jpg`

export default function CanvasPlayer({ onProgress }) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const rafRef = useRef(null)
  const curRef = useRef(0)
  const targetRef = useRef(0)
  const [loaded, setLoaded] = useState(false)
  const [pct, setPct] = useState(0)

  // ── Preload ──────────────────────────────────────────────
  useEffect(() => {
    let done = 0
    const imgs = Array.from({ length: TOTAL }, (_, i) => {
      const img = new Image()
      img.src = src(i + 1)
      img.onload = img.onerror = () => {
        done++
        setPct(Math.round((done / TOTAL) * 100))
        if (done === TOTAL) { framesRef.current = imgs; setLoaded(true) }
      }
      return img
    })
  }, [])

  // ── Draw ─────────────────────────────────────────────────
  function draw(idx) {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = framesRef.current[idx]
    if (!img?.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    const { width: cw, height: ch } = canvas
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const w = img.naturalWidth * s, h = img.naturalHeight * s
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
  }

  // ── Resize ───────────────────────────────────────────────
  useEffect(() => {
    function resize() {
      const c = canvasRef.current
      if (!c) return
      c.width = window.innerWidth
      c.height = window.innerHeight
      draw(curRef.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [loaded])

  // ── GSAP ScrollTrigger — scrub drives progress ───────────
  useEffect(() => {
    if (!loaded) return

    const proxy = { frame: 0 }

    const st = ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        targetRef.current = Math.round(p * (TOTAL - 1))
        onProgress(p)
      },
    })

    return () => st.kill()
  }, [loaded, onProgress])

  // ── RAF lerp loop ────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    function loop() {
      const cur = curRef.current
      const tgt = targetRef.current
      if (cur !== tgt) {
        // Smooth lerp — never jumps more than ~8 frames per tick
        const delta = tgt - cur
        const step = Math.sign(delta) * Math.min(Math.abs(delta), Math.max(1, Math.abs(delta) * 0.18))
        const next = Math.round(cur + step)
        const clamped = Math.min(Math.max(next, 0), TOTAL - 1)
        curRef.current = clamped
        draw(clamped)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loaded])

  return (
    <>
      {/* Loading screen */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
          <div
            className="text-[10px] tracking-[0.5em] uppercase mb-8"
            style={{ color: 'rgba(201,168,76,0.6)' }}
          >
            Ramora Realty
          </div>
          <div className="w-40 h-px bg-white/8 relative overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 bg-gold"
              style={{ width: `${pct}%`, transition: 'width 0.15s linear' }}
            />
          </div>
          <div className="text-[10px] tracking-widest tabular-nums" style={{ color: 'rgba(255,255,255,0.15)' }}>
            {pct}%
          </div>
        </div>
      )}

      {/* ── Multi-layer contrast system ─────────────────────────────────────
           Layer 1: base darkening across entire frame (never fully transparent)
           Layer 2: strong vignette — edges + top + bottom crushed to black
           Layer 3: radial clear zone — center stays slightly brighter so
                    the architecture is still visible behind text
      ────────────────────────────────────────────────────────────────────── */}

      {/* Base dim — uniform darkening so no frame is ever raw-bright */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.52)', zIndex: 2 }}
      />

      {/* Vignette — crushes edges, top, bottom to near-black */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 75% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.88) 100%)',
          zIndex: 3,
        }}
      />

      {/* Top & bottom gradient bars — anchor text zones */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 22%, transparent 75%, rgba(0,0,0,0.80) 100%)',
          zIndex: 4,
        }}
      />

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1.2s ease', zIndex: 1 }}
      />

    </>
  )
}
