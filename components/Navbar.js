import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const links = ['Home', 'About', 'Services', 'Projects', 'Contact']

export default function Navbar() {
  const ref = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  // Entrance animation
  useEffect(() => {
    gsap.from(ref.current, {
      y: -20,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.6,
    })
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      ref={ref}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-12 py-5"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'background 0.6s ease, border-color 0.6s ease, backdrop-filter 0.6s ease',
      }}
    >
      <span className="text-white font-bold tracking-tight text-base">
        Ramora<span className="text-gold">Realty</span>
      </span>

      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <a
            key={l}
            href="#"
            className="text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white/90 transition-colors duration-300"
          >
            {l}
          </a>
        ))}
      </div>

      <a href="#contact" className="btn-primary text-[10px] py-2.5 px-5">
        Book Consultation
      </a>
    </nav>
  )
}
