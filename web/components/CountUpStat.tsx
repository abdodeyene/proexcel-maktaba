'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpStatProps {
  value: string   // e.g. "1200+", "15K+", "30%"
  label: string
  delay?: number  // ms stagger
}

function parseValue(raw: string): { num: number; prefix: string; suffix: string } {
  const str = raw.trim()
  const prefixMatch = str.match(/^([^0-9]*)/)
  const prefix = prefixMatch ? prefixMatch[1] : ''
  const rest = str.slice(prefix.length)
  const numMatch = rest.match(/^([0-9.,]+)/)
  const numStr = numMatch ? numMatch[1].replace(',', '') : '0'
  const rawSuffix = rest.slice(numStr.length)
  let num = parseFloat(numStr)
  let suffix = rawSuffix
  if (/^[kK]/i.test(rawSuffix)) { num *= 1000; suffix = rawSuffix.slice(1) }
  else if (/^[mM]/i.test(rawSuffix)) { num *= 1_000_000; suffix = rawSuffix.slice(1) }
  return { num, prefix, suffix }
}

// Returns a display string for intermediate animation values.
// K-format is only applied once the animated value reaches 1000+,
// avoiding ugly intermediate values like "0.2K".
function formatNum(n: number, original: string): string {
  const rounded = Math.round(n)
  if (/[kK]/i.test(original)) {
    if (rounded < 1000) return rounded.toString()
    const k = rounded / 1000
    // Show integer K (e.g. "15K") — no decimals mid-animation
    return `${Math.round(k)}K`
  }
  return rounded.toString()
}

export default function CountUpStat({ value, label, delay = 0 }: CountUpStatProps) {
  const [displayed, setDisplayed] = useState('0')
  const [visible, setVisible] = useState(false)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { num, prefix, suffix } = parseValue(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || started) return
    const t = setTimeout(() => {
      setStarted(true)
      const duration = 1600
      const steps = 55
      let step = 0
      const iv = setInterval(() => {
        step++
        // Cubic ease-out: fast start, smooth deceleration
        const eased = 1 - Math.pow(1 - step / steps, 3)
        setDisplayed(formatNum(num * eased, value))
        if (step >= steps) {
          clearInterval(iv)
          // Final value: preserve original suffix exactly (e.g. "15K+", "30%")
          setDisplayed(formatNum(num, value))
        }
      }, duration / steps)
    }, delay)
    return () => clearTimeout(t)
  }, [visible, started, num, delay, value])

  return (
    <div
      ref={ref}
      className={`cs${visible ? ' cs--on' : ''}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      <span className="cs-num">{prefix}{displayed}{suffix}</span>
      <span className="cs-label">{label}</span>

      <style jsx>{`
        .cs {
          text-align: center;
          padding: 0 2.2rem;
          border-right: 1px solid rgba(255,255,255,0.12);
          opacity: 0;
          transform: translateY(14px);
          transition:
            opacity  0.55s cubic-bezier(0.16,1,0.3,1) var(--d, 0ms),
            transform 0.55s cubic-bezier(0.16,1,0.3,1) var(--d, 0ms);
        }
        .cs:first-child { padding-left: 0; }
        .cs:last-child  { border-right: none; padding-right: 0; }
        .cs--on { opacity: 1; transform: translateY(0); }

        .cs-num {
          display: block;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.4rem;
          /* Warm glow — subtle, not a duplicate outline */
          text-shadow: 0 2px 20px rgba(232,53,42,0.15);
          white-space: nowrap;
        }

        .cs-label {
          display: block;
          font-size: 0.65rem;
          font-family: var(--font-latin);
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 1.8px;
          opacity: 0;
          transition: opacity 0.4s ease calc(var(--d, 0ms) + 260ms);
        }
        .cs--on .cs-label { opacity: 1; }

        @media (max-width: 640px) {
          .cs { padding: 0; border-right: none; }
          .cs-num { font-size: 2rem; }
        }
      `}</style>
    </div>
  )
}
