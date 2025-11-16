import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const messages = [
  'Currently accepting 3 clients this quarter',
  '127% average conversion lift',
  '50+ brands transformed',
]

export default function DataTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-6 overflow-hidden" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[14px] tracking-tight"
          style={{ color: '#2C5F4D' }}
        >
          {messages[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
