'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLang } from '@/components/LangContext'

export default function ThankYouClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang, t, isRTL } = useLang()
  const [orderNum, setOrderNum] = useState('#PE000001')

  useEffect(() => {
    const orderParam = searchParams.get('order')
    if (orderParam) {
      setOrderNum(orderParam.startsWith('#') ? orderParam : `#${orderParam}`)
    } else {
      setOrderNum(`#PE${Date.now().toString().slice(-6)}`)
    }

    // Confetti logic
    const launchConfetti = () => {
      const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#ef4444', '#f59e0b', '#ec4899', '#06b6d4']
      const container = document.getElementById('confettiContainer')
      if (!container) return

      for (let i = 0; i < 80; i++) {
        setTimeout(() => {
          const piece = document.createElement('div')
          piece.className = 'confetti-piece'
          const color = colors[Math.floor(Math.random() * colors.length)]
          const size = Math.random() * 10 + 6
          
          piece.style.cssText = `
            left: ${Math.random() * 100}vw;
            width: ${size}px; height: ${size}px;
            background: ${color};
            animation-duration: ${Math.random() * 2 + 2}s;
            animation-delay: ${Math.random() * 0.5}s;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            transform: rotate(${Math.random() * 360}deg);
          `
          container.appendChild(piece)
          setTimeout(() => piece.remove(), 4000)
        }, i * 40)
      }
    }

    const timer1 = setTimeout(launchConfetti, 400)
    const timer2 = setTimeout(launchConfetti, 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [searchParams])

  const T = {
    badge: t('Commande confirmée', 'تم تأكيد الطلب'),
    thanks: t('Merci pour votre commande !', 'شكراً جزيلاً لطلبك!'),
    order: t('Commande n°', 'رقم الطلب'),
    message: t(
      'Votre commande a été reçue et est en cours de traitement. Vous serez contacté sous 24h pour la confirmation de livraison.',
      'تم استلام طلبك وهو قيد المعالجة حالياً. سنتصل بك خلال 24 ساعة لتأكيد موعد التسليم.'
    ),
    step1: t('Commande reçue', 'تم الاستلام'),
    step2: t('En préparation', 'قيد التحضير'),
    step3: t('Livraison sous 48h', 'توصيل في 48 ساعة'),
    btnHome: t("Retour à l'accueil", 'العودة للرئيسية'),
    btnShop: t('Continuer mes achats', 'متابعة التسوق'),
  }

  return (
    <>
      {/* Floating bg circles */}
      <div className="ty-bg">
        <div className="ty-circle"></div>
        <div className="ty-circle"></div>
        <div className="ty-circle"></div>
      </div>

      {/* Confetti container */}
      <div className="ty-confetti-container" id="confettiContainer"></div>

      <div className="thankyou-page" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="ty-card">

          {/* Animated checkmark */}
          <div className="ty-checkmark-wrap">
            <div className="ty-checkmark-circle">
              <svg viewBox="0 0 52 52" style={{ fill: 'none', stroke: '#fff', strokeWidth: '4px' }}>
                <path d="M14 27 L22 35 L38 17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="ty-pulse"></div>
          </div>

          <div className="ty-badge">
            ✨ <span>{T.badge}</span>
          </div>

          <h1 className="ty-title">{T.thanks}</h1>

          <p className="ty-order-num">
            <span>{T.order}</span>{' '}
            <strong id="tyOrderNum">{orderNum}</strong>
          </p>

          <p className="ty-message">
            {T.message}
          </p>

          {/* Steps */}
          <div className="ty-steps">
            <div className="ty-step">
              <div className="ty-step-icon">📦</div>
              <div className="ty-step-label">{T.step1}</div>
            </div>
            <div className="ty-step">
              <div className="ty-step-icon">⚙️</div>
              <div className="ty-step-label">{T.step2}</div>
            </div>
            <div className="ty-step">
              <div className="ty-step-icon">🚚</div>
              <div className="ty-step-label">{T.step3}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="ty-btns">
            <button className="ty-btn-primary" onClick={() => router.push('/')}>
              <span>{T.btnHome}</span>
            </button>
            <button className="ty-btn-outline" onClick={() => router.push('/best-offers')}>
              <span>{T.btnShop}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

