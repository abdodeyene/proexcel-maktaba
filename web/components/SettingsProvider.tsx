'use client'

import { useEffect } from 'react'

export default function SettingsProvider() {
  useEffect(() => {
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
        
        // Button colors
        if (data.btn_normal) root.style.setProperty('--btn-normal', data.btn_normal)
        if (data.btn_hover) root.style.setProperty('--btn-hover', data.btn_hover)
        if (data.btn_text) root.style.setProperty('--btn-text', data.btn_text)

        // Home backgrounds
        if (data.home_bg1 && data.home_bg2) {
            root.style.setProperty('--home-bg-grad', `linear-gradient(135deg, ${data.home_bg1}, ${data.home_bg2})`)
        }

        // Store them globally if needed by components without re-fetching
        // (Like Header logo which we can update via event or just let it fetch itself)

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
  }, [])

  return null
}
