import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// ── Scroll beat ranges (0–1) ─────────────────────────────────────────────────
// Each section has: in, holdStart, holdEnd, out
// "breathing" gaps between sections = intentional visual-only zones
const BEATS = [
  { id: 'hero',         in: 0.00, hold0: 0.04, hold1: 0.17, out: 0.21 },
  { id: 'brand',        in: 0.22, hold0: 0.25, hold1: 0.33, out: 0.37 },
  { id: 'pillars',      in: 0.38, hold0: 0.41, hold1: 0.52, out: 0.56 },
  { id: 'developments', in: 0.57, hold0: 0.60, hold1: 0.68, out: 0.72 },
  { id: 'trust',        in: 0.73, hold0: 0.75, hold1: 0.81, out: 0.84 },
  { id: 'pricing',      in: 0.85, hold0: 0.87, hold1: 0.92, out: 0.95 },
  { id: 'cta',          in: 0.96, hold0: 0.97, hold1: 1.00, out: 1.00 },
]

function useBeatGsap(ref, beat, progress) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { in: i, hold0, hold1, out } = beat

    let opacity = 0
    let y = 18

    if (progress < i) {
      opacity = 0; y = 18
    } else if (progress >= i && progress < hold0) {
      // Fade in
      const t = (progress - i) / (hold0 - i)
      opacity = t
      y = 18 * (1 - t)
    } else if (progress >= hold0 && progress <= hold1) {
      // Full hold
      opacity = 1; y = 0
    } else if (progress > hold1 && progress <= out) {
      // Fade out — slow exit
      const t = (progress - hold1) / (out - hold1)
      opacity = 1 - t
      y = -12 * t
    } else {
      opacity = 0; y = -12
    }

    gsap.set(el, { opacity, y, force3D: true })
  }, [progress, beat])
}

// ── Individual beat wrapper ──────────────────────────────────────────────────
function Beat({ beat, progress, children }) {
  const ref = useRef(null)
  useBeatGsap(ref, beat, progress)
  return (
    <div ref={ref} className="beat" style={{ zIndex: 30 }}>
      {/* Frosted text-backdrop — localised dark halo behind content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {children}
      </div>
    </div>
  )
}

// ── Stat counter (GSAP number tween on enter) ────────────────────────────────
function StatRow({ progress, triggerAt = 0.04 }) {
  const ref = useRef(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (triggered.current || progress < triggerAt) return
    triggered.current = true
    const els = ref.current?.querySelectorAll('.stat-num')
    if (!els) return
    gsap.from(els, { y: 20, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2 })
  }, [progress >= triggerAt])

  return (
    <div ref={ref} className="flex gap-8 md:gap-12 mt-12 justify-center">
      {[['15+', 'Years Experience'], ['200+', 'Projects Delivered'], ['50+', 'Active Clients'], ['100%', 'Accountability']].map(([n, l]) => (
        <div key={l} className="text-center">
          <div className="stat-num text-xl md:text-2xl font-bold text-gold" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}>{n}</div>
          <div className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.55)', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{l}</div>
        </div>
      ))}
    </div>
  )
}

// ── Main overlay ─────────────────────────────────────────────────────────────
export default function CopyOverlay({ progress }) {
  // Hero stagger on first load
  const heroRef = useRef(null)
  const heroAnimated = useRef(false)

  useEffect(() => {
    if (heroAnimated.current || progress > 0.03) return
    heroAnimated.current = true
    const els = heroRef.current?.querySelectorAll('.hero-el')
    if (!els?.length) return
    gsap.from(els, {
      y: 28,
      opacity: 0,
      stagger: 0.18,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.4,
    })
  }, [progress < 0.03])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 30 }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <Beat beat={BEATS[0]} progress={progress}>
        <div ref={heroRef} className="max-w-3xl mx-auto w-full">
          <div className="hero-el tag">Develop · Invest · Deliver</div>
          <h1 className="hero-el text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] mb-4" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,1)' }}>
            RAMORA<br />REALTY
          </h1>
          <p className="hero-el text-sm md:text-base max-w-sm mx-auto mb-8 font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
            Integrated real estate development,<br />planning, and execution solutions.
          </p>
          <div className="hero-el flex gap-3 justify-center pointer-events-auto">
            <a href="#contact" className="btn-primary">Book Consultation</a>
            <a href="#developments" className="btn-secondary">View Developments</a>
          </div>
          <StatRow progress={progress} triggerAt={0.04} />
        </div>
      </Beat>

      {/* ── BRAND FOUNDATION ──────────────────────────────── */}
      <Beat beat={BEATS[1]} progress={progress}>
        <div className="max-w-2xl mx-auto">
          <div className="tag">Our Philosophy</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}>
            Structured real estate.<br />
            <span className="font-light italic" style={{ color: 'rgba(255,255,255,0.65)' }}>Built for long-term value.</span>
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 10px rgba(0,0,0,0.9)' }}>
            From land identification to final delivery — every step is planned,
            verified, and executed with precision.
          </p>
        </div>
      </Beat>

      {/* ── THREE PILLARS ─────────────────────────────────── */}
      <Beat beat={BEATS[2]} progress={progress}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="tag">What We Do</div>
          <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
            {[
              ['DEVELOP', 'Township planning, layout development, residential & commercial plotting, group housing projects.'],
              ['INVEST', 'Plot advisory, ROI guidance, commercial property evaluation, asset growth planning.'],
              ['DELIVER', 'Construction execution, interior design, turnkey projects and handover.'],
            ].map(([title, desc]) => (
              <div key={title} className="glass-card px-6 py-7 flex-1 text-left transition-colors duration-500">
                <div className="gold-line" />
                <div className="text-[10px] tracking-[0.35em] text-gold uppercase mb-3">{title}</div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Beat>

      {/* ── KEY DEVELOPMENTS ──────────────────────────────── */}
      <Beat beat={BEATS[3]} progress={progress}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="tag">Key Developments</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Residential Plots', 'Premium plotted developments in strategic locations with approved layouts.'],
              ['Commercial Plots', 'High-visibility commercial land parcels with strong ROI potential.'],
              ['Group Housing', 'Planned residential communities with shared amenities and infrastructure.'],
              ['Construction & Interiors', 'End-to-end build execution with curated interior design packages.'],
            ].map(([t, d]) => (
              <div key={t} className="glass-card p-5 text-left">
                <div className="gold-line" />
                <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.92)' }}>{t}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </Beat>

      {/* ── WHY RAMORA ────────────────────────────────────── */}
      <Beat beat={BEATS[4]} progress={progress}>
        <div className="max-w-2xl mx-auto">
          <div className="tag">Why Ramora</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}>
            Built on trust.<br />
            <span className="font-light" style={{ color: 'rgba(255,255,255,0.65)' }}>Delivered with precision.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Approved Layouts', 'Transparent Documentation', 'Strategic Locations', 'End-to-End Planning'].map((item) => (
              <div key={item} className="glass-card flex items-center gap-2.5 px-5 py-2.5">
                <div className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.88)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Beat>

      {/* ── PRICING ───────────────────────────────────────── */}
      <Beat beat={BEATS[5]} progress={progress}>
        <div className="max-w-3xl mx-auto w-full">
          <div className="tag">Construction Packages</div>
          <div className="flex flex-col md:flex-row gap-2.5 justify-center">
            {[
              ['Basic', '₹999', false],
              ['Standard', '₹1,599', false],
              ['Premium', '₹1,999', true],
              ['Luxury', '₹2,499+', false],
            ].map(([tier, price, rec]) => (
              <div
                key={tier}
                className={`px-6 py-7 text-center flex-1 transition-all duration-500 ${
                  rec
                    ? 'border border-gold/60 bg-gold/8'
                    : 'glass-card'
                }`}
              >
                {rec && (
                  <div className="text-[9px] tracking-[0.25em] text-gold uppercase mb-2">Recommended</div>
                )}
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{tier}</div>
                <div className="text-2xl font-bold" style={{ color: rec ? '#C9A84C' : 'rgba(255,255,255,0.92)' }}>{price}</div>
                <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>/ sq.ft</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.50)' }}>Financing available via LIC · HDFC · ICICI · SBI · Kotak · Poonawalla</div>
          </div>
        </div>
      </Beat>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <Beat beat={BEATS[6]} progress={progress}>
        <div className="max-w-xl mx-auto">
          <div className="tag">Get Started</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.95)' }}>
            Discuss Your<br />Development<br />Requirements
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
            Our team is ready to plan, structure,<br />and deliver your vision.
          </p>
          <a href="#contact" className="btn-primary pointer-events-auto">
            Request Consultation
          </a>
        </div>
      </Beat>

    </div>
  )
}
