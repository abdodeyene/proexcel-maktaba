'use client'

import { Truck, ShieldCheck, Sparkles, MessageCircle, BookOpen, Users } from '@/components/LucideIcons'

interface InfoStripProps {
  lang?: string
}

export default function InfoStrip({ lang = 'fr' }: InfoStripProps) {
  const isAr = lang === 'ar'

  const items = isAr
    ? [
        { icon: 'book',    title: '+1200 عنوان متوفر',   sub: 'كتب ومستلزمات', color: 'purple' },
        { icon: 'users',   title: '+15K عميل راضٍ',      sub: 'على مستوى المغرب', color: 'gold' },
        { icon: 'truck',   title: 'توصيل 24/48 ساعة',   sub: 'في جميع أنحاء المغرب', color: 'blue' },
        { icon: 'shield',  title: 'الدفع عند الاستلام',   sub: 'أو عبر البطاقة', color: 'red' },
        { icon: 'whatsapp',title: 'دعم واتساب 6j/7',     sub: 'لأي استفسار أو مساعدة', color: 'green' },
      ]
    : [
        { icon: 'book',    title: '+1200 titres',         sub: 'Disponibles en stock', color: 'purple' },
        { icon: 'users',   title: '+15K clients',         sub: 'Satisfaits de nos services', color: 'gold' },
        { icon: 'truck',   title: 'Livraison 24/48h',     sub: 'Partout au Maroc', color: 'blue' },
        { icon: 'shield',  title: 'Paiement à la livraison', sub: 'Ou par carte bancaire', color: 'red' },
        { icon: 'whatsapp',title: 'Support WhatsApp',     sub: 'Conseils & commande 7j/7', color: 'green' },
      ]

  const iconMap: Record<string, React.ReactNode> = {
    truck:    <Truck size={20} />,
    shield:   <ShieldCheck size={20} />,
    premium:  <Sparkles size={20} />,
    whatsapp: <MessageCircle size={20} />,
    book:     <BookOpen size={20} />,
    users:    <Users size={20} />,
  }

  return (
    <div className="info-strip-section" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Animated subtle glow border wrapper */}
      <div className="info-strip-wrapper animate-fadeInUp [animation-delay:200ms]">
        <div className="info-strip" role="list" aria-label="Informations livraison et garanties">
          {items.map((item, i) => (
            <div 
              key={i} 
              className={`info-strip-item group shine-sweep animate-fadeInUp`} 
              style={{ animationDelay: `${300 + (i * 100)}ms` }}
              role="listitem"
            >
              <div className={`info-strip-icon-wrap info-strip-icon-wrap--${item.color}`} aria-hidden="true">
                {iconMap[item.icon]}
              </div>
              <div className="info-strip-text">
                <span className="info-strip-title">{item.title}</span>
                <span className="info-strip-sub">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .info-strip-section {
          max-width: 1440px;
          margin: 0 auto;
          padding: 1rem 1.5rem 2rem;
          margin-top: -4rem;
          position: relative;
          z-index: 30;
        }

        .info-strip-wrapper {
          position: relative;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 40px rgba(14, 165, 233, 0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .info-strip-wrapper:hover {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 50px rgba(239, 68, 68, 0.1);
        }

        .info-strip {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          background: rgba(10, 15, 26, 0.65);
          border-radius: 23px;
          overflow: hidden;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        [data-theme="light"] .info-strip {
          background: rgba(255, 255, 255, 0.75);
        }

        .info-strip-item {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 1.75rem 1.4rem;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          position: relative;
          z-index: 1;
        }

        [dir="rtl"] .info-strip-item {
          border-right: none;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-strip-item:last-child {
          border-right: none;
          border-left: none;
        }

        .info-strip-item:hover {
          background: rgba(255, 255, 255, 0.03);
          transform: translateY(-5px) scale(1.02);
          z-index: 2;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }
        
        [data-theme="light"] .info-strip-item:hover {
          background: rgba(0, 0, 0, 0.02);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .info-strip-icon-wrap {
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .info-strip-item:hover .info-strip-icon-wrap {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 20px currentColor;
        }

        /* Soft color variations for icons */
        .info-strip-icon-wrap--blue { background: rgba(14, 165, 233, 0.12); color: #0ea5e9; }
        .info-strip-icon-wrap--red { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
        .info-strip-icon-wrap--purple { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
        .info-strip-icon-wrap--green { background: rgba(34, 197, 94, 0.12); color: #22c55e; }
        .info-strip-icon-wrap--gold { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }

        .info-strip-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }

        .info-strip-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: #f1ede4;
          line-height: 1.25;
        }
        [data-theme="light"] .info-strip-title { color: #1e293b; }

        .info-strip-sub {
          font-size: 0.78rem;
          color: #8896a9;
          line-height: 1.3;
        }
        [data-theme="light"] .info-strip-sub { color: #64748b; }

        @media (max-width: 1200px) {
          .info-strip {
            grid-template-columns: repeat(4, 1fr);
          }
          .info-strip-item:nth-child(4) { border-right: none; }
          .info-strip-item:nth-child(5) {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 900px) {
          .info-strip {
            grid-template-columns: repeat(3, 1fr);
          }
          .info-strip-item:nth-child(3) { border-right: none; border-left: none; }
          .info-strip-item:nth-child(4), .info-strip-item:nth-child(5) {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }
        }

        @media (max-width: 768px) {
          .info-strip-section {
            margin-top: -1.75rem;
            padding: 0 14px;
          }
          .info-strip-wrapper {
            background: none;
            box-shadow: none;
            padding: 0;
          }
          .info-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            overflow: visible !important;
          }
          .info-strip-item {
            background: rgba(17, 24, 39, 0.6) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.06) !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
            padding: 12px !important;
            gap: 0.65rem !important;
            border-right: none !important;
            border-left: none !important;
            display: flex !important;
            align-items: center !important;
            transform: none !important;
          }
          [data-theme="light"] .info-strip-item {
            background: rgba(255, 255, 255, 0.8) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03) !important;
          }
          .info-strip-item:hover {
            transform: translateY(-2px) scale(1.01) !important;
          }
          .info-strip-icon-wrap {
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
          }
          .info-strip-icon-wrap :global(svg) { width: 16px !important; height: 16px !important; }
          .info-strip-title { font-size: 12px !important; }
          .info-strip-sub { font-size: 10px !important; }
        }
      `}</style>
    </div>
  )
}
