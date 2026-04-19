import { useCallback, useRef, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import CopyOverlay from '../components/CopyOverlay'
import Footer from '../components/Footer'

const CanvasPlayer = dynamic(() => import('../components/CanvasPlayer'), { ssr: false })

export default function Home() {
  const [progress, setProgress] = useState(0)
  const onProgress = useCallback((p) => setProgress(p), [])

  return (
    <>
      <Head>
        <title>Ramora Realty — Develop · Invest · Deliver</title>
        <meta name="description" content="Integrated real estate development, planning, and execution solutions. From township layouts to turnkey delivery." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      {/*
        1000vh scroll container — GSAP ScrollTrigger pins the viewport
        and maps scroll progress → frame index + copy beats.
        The canvas + overlay are fixed; only this div creates scroll height.
      */}
      <div id="scroll-container" style={{ height: '1000vh' }}>
        <CanvasPlayer onProgress={onProgress} />
        <CopyOverlay progress={progress} />
      </div>

      {/* Scroll hint — fades out after first scroll */}
      <div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        style={{
          opacity: progress < 0.025 ? 1 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: 'none',
        }}
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/25">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      {/* Gold progress line — bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-30 h-px bg-white/4">
        <div
          className="h-full bg-gold"
          style={{ width: `${progress * 100}%`, transition: 'width 0.08s linear' }}
        />
      </div>

      <Footer />
    </>
  )
}
