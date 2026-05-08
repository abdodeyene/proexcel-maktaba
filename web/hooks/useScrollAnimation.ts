'use client'

import { useEffect } from 'react'

export function useScrollAnimation() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = (root: Element | Document = document) => {
      root.querySelectorAll('.scroll-reveal:not(.is-observed)').forEach(el => {
        el.classList.add('is-observed')
        io.observe(el)
      })
    }

    observe()

    // Watch for dynamically added elements (data-fetched cards, grids, etc.)
    const mo = new MutationObserver(() => observe())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
