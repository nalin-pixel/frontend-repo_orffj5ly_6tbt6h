import { useEffect, useMemo, useRef } from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'
import DataTicker from './DataTicker'
import ScrollIndicator from './ScrollIndicator'
import FluidBackground from './FluidBackground'

const lineVariants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 8 },
  visible: (i) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { delay: 0.4 + i * 0.8, duration: 0.8, ease: 'easeOut' },
  }),
}

export default function Hero() {
  const containerRef = useRef(null)

  // Scroll-linked transforms
  useEffect(() => {
    const el = containerRef.current
    const onScroll = () => {
      const s = Math.min(1, window.scrollY / window.innerHeight)
      // Set CSS variables for use in styles
      el.style.setProperty('--heroScale', String(1 - s * 0.15))
      el.style.setProperty('--heroOpacity', String(1 - s * 0.7))
      el.style.setProperty('--netScale', String(1 - s * 0.3))
      el.style.setProperty('--netTranslateY', String(-150 * s + 'px'))
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Fluid gradient mesh background */}
      <FluidBackground />

      {/* Spline 3D cover on the right 60% */}
      <div className="absolute right-0 top-0 h-full w-[60%]" style={{ transform: 'translateZ(0) scale(var(--netScale, 1)) translateY(var(--netTranslateY, 0))', transformOrigin: 'center right' }}>
        <Spline scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
      </div>

      {/* Left content */}
      <div className="relative z-10 flex min-h-screen items-center" style={{ paddingLeft: '8vw', paddingRight: '8vw' }}>
        <div className="w-[45%]" style={{ color: '#FAFAFA' }}>
          <div>
            {['We Engineer', 'Attention,', 'Emotion,', 'Action.'].map((t, i) => (
              <motion.h1
                key={i}
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="font-[Playfair Display] text-[64px] leading-[1.1] tracking-[-0.02em]"
              >
                {t}
              </motion.h1>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + 0.8 * 4 + 1.2, duration: 0.6 }}
            className="mt-6 text-[18px] leading-[1.6] max-w-[60ch]"
            style={{ color: '#999999' }}
          >
            Psychology-driven design for brands that demand measurable results.
          </motion.p>

          <div className="mt-10">
            <DataTicker />
          </div>

          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + 0.8 * 4 + 1.2 + 0.8, duration: 0.5 }}
            className="mt-14 inline-flex items-center gap-2"
            style={{
              backgroundColor: '#2C5F4D',
              color: '#FFFFFF',
              padding: '18px 36px',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(44,95,77,0.3)',
              transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(var(--heroScale,1))',
              opacity: 'var(--heroOpacity,1)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px) scale(var(--heroScale,1))')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0px) scale(var(--heroScale,1))')}
          >
            <span className="text-[16px] font-medium">Explore The Framework</span>
            <span aria-hidden>→</span>
          </motion.button>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
