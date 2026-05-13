'use client'

import { useEffect } from 'react'
import { buildButtonStyleSheet, sanitizeButtonStyles } from '@/lib/buttonStyles'

function applyButtonStyles(rawStyles: unknown) {
  const css = buildButtonStyleSheet(sanitizeButtonStyles(rawStyles))
  let el = document.getElementById('proexcel-btn-custom') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'proexcel-btn-custom'
    document.head.appendChild(el)
  }
  el.textContent = css
}

export default function SettingsProvider() {
  useEffect(() => {
    try {
      const cached = localStorage.getItem('proexcel_button_styles')
      if (cached) applyButtonStyles(JSON.parse(cached))
    } catch { /* ignore cached styles */ }

    const onLocalUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail
      applyButtonStyles(detail)
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'proexcel_button_styles' || !event.newValue) return
      try { applyButtonStyles(JSON.parse(event.newValue)) } catch { /* ignore */ }
    }

    const channel = typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel('proexcel-button-styles')
      : null

    if (channel) {
      channel.onmessage = event => applyButtonStyles(event.data)
    }

    window.addEventListener('proexcel-button-styles:update', onLocalUpdate)
    window.addEventListener('storage', onStorage)

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data || typeof data !== 'object') return

        const root = document.documentElement

        // Map settings to CSS variables
        if (data.col_primary) root.style.setProperty('--primary', data.col_primary)
        if (data.col_secondary) root.style.setProperty('--purple', data.col_secondary)
        if (data.col_promo) root.style.setProperty('--red', data.col_promo)
        if (data.col_success) root.style.setProperty('--green', data.col_success)

        if (data.home_bg1 && data.home_bg2) {
          root.style.setProperty('--home-bg-grad', `linear-gradient(135deg, ${data.home_bg1}, ${data.home_bg2})`)
        }

        // Product page specific styles
        if (data.pp_btn_radius) root.style.setProperty('--pp-btn-radius', data.pp_btn_radius)
        if (data.pp_btn_shadow) root.style.setProperty('--pp-btn-shadow', data.pp_btn_shadow)
        if (data.pp_btn_hover_col) root.style.setProperty('--pp-btn-hover-col', data.pp_btn_hover_col)
        if (data.pp_cta_bg) root.style.setProperty('--pp-cta-bg', data.pp_cta_bg)
        if (data.pp_cta_text) root.style.setProperty('--pp-cta-text', data.pp_cta_text)
        if (data.pp_outline_col) root.style.setProperty('--pp-outline-col', data.pp_outline_col)
        if (data.pp_price_color) root.style.setProperty('--pp-price-col', data.pp_price_color)

        // Per-button custom styles
        if (data.button_styles) {
          try {
            const btnStyles = sanitizeButtonStyles(JSON.parse(data.button_styles))
            localStorage.setItem('proexcel_button_styles', JSON.stringify(btnStyles))
            applyButtonStyles(btnStyles)
          } catch { /* ignore */ }
        }

        // Dynamic favicon
        if (data.site_favicon) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null
          if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
          }
          link.href = data.site_favicon
        }

        // Inject Pixels
        if (data.pixel_fb) {
          const script = document.createElement('script')
          script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${data.pixel_fb}');
            fbq('track', 'PageView');
          `
          document.head.appendChild(script)
        }
        if (data.pixel_tiktok) {
          const script = document.createElement('script')
          script.innerHTML = `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${data.pixel_tiktok}');
              ttq.page();
            }(window, document, 'ttq');
          `
          document.head.appendChild(script)
        }
        if (data.pixel_google) {
          const script1 = document.createElement('script')
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${data.pixel_google}`
          script1.async = true
          document.head.appendChild(script1)

          const script2 = document.createElement('script')
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${data.pixel_google}');
          `
          document.head.appendChild(script2)
        }
      })
      .catch(console.error)

    return () => {
      window.removeEventListener('proexcel-button-styles:update', onLocalUpdate)
      window.removeEventListener('storage', onStorage)
      channel?.close()
    }
  }, [])

  return null
}
