import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 3000)
    const onScroll = () => setHidden(true)
    window.addEventListener('scroll', onScroll)
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 bottom-10 transition-opacity duration-500 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-3 text-xs tracking-wide" style={{ color: '#2C5F4D' }}>
        <div className="relative h-[60px] w-px bg-[rgba(44,95,77,0.9)]">
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[rgba(44,95,77,1)] animate-ping" />
        </div>
        <span className="text-[12px] text-[rgba(44,95,77,0.9)]">Scroll to see psychology in action</span>
      </div>
    </div>
  )
}
