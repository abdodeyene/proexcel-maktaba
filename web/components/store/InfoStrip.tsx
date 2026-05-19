'use client'

import { Truck, ShieldCheck, BookOpen, Users } from '@/components/LucideIcons'

interface InfoStripProps {
  lang?: string
}

export default function InfoStrip({ lang = 'fr' }: InfoStripProps) {
  const isAr = lang === 'ar'

  const items = isAr
    ? [
        { icon: 'truck',  title: 'توصيل خلال 48 ساعة',  sub: 'في جميع أنحاء المغرب' },
        { icon: 'shield', title: 'دفع آمن',               sub: 'معاملات محمية' },
        { icon: 'book',   title: '+1200 عنوان',            sub: 'كتالوج شامل' },
        { icon: 'users',  title: '+15K عميل',              sub: 'عملاء راضون' },
      ]
    : [
        { icon: 'truck',  title: 'Livraison 48h',         sub: 'Partout au Maroc' },
        { icon: 'shield', title: 'Paiement Sécurisé',     sub: 'Transactions protégées' },
        { icon: 'book',   title: '1200+ Titres',          sub: 'Catalogue complet' },
        { icon: 'users',  title: '15K+ Clients',          sub: 'Clients satisfaits' },
      ]

  const iconMap: Record<string, React.ReactNode> = {
    truck:  <Truck  size={20} />,
    shield: <ShieldCheck size={20} />,
    book:   <BookOpen size={20} />,
    users:  <Users  size={20} />,
  }

  return (
    <>
      <div className="info-strip" dir={isAr ? 'rtl' : 'ltr'} role="list" aria-label="Informations livraison et garanties">
        {items.map((item, i) => (
          <div key={i} className="info-strip-item" role="listitem">
            <div className="info-strip-icon-wrap" aria-hidden="true">
              {iconMap[item.icon]}
            </div>
            <div className="info-strip-text">
              <span className="info-strip-title">{item.title}</span>
              <span className="info-strip-sub">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .info-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--card);
          border-bottom: 1px solid var(--border);
          position: relative;
          z-index: 1;
        }

        .info-strip-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1.25rem 1.75rem;
          border-right: 1px solid var(--border);
          transition: background 0.18s ease;
          cursor: default;
        }

        .info-strip-item:last-child {
          border-right: none;
        }

        .info-strip-item:hover {
          background: rgba(232, 53, 42, 0.05);
        }

        .info-strip-icon-wrap {
          color: var(--primary);
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(232, 53, 42, 0.12);
          transition: background 0.18s ease, transform 0.18s ease;
        }

        .info-strip-item:hover .info-strip-icon-wrap {
          background: rgba(232, 53, 42, 0.2);
          transform: scale(1.06);
        }

        .info-strip-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }

        .info-strip-title {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--text);
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .info-strip-sub {
          font-size: 0.71rem;
          color: var(--text2);
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 900px) {
          .info-strip-item {
            padding: 1.1rem 1.25rem;
            gap: 0.7rem;
          }
          .info-strip-title {
            font-size: 0.82rem;
          }
        }

        @media (max-width: 640px) {
          .info-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .info-strip-item:nth-child(2) {
            border-right: none;
          }
          .info-strip-item:nth-child(3),
          .info-strip-item:nth-child(4) {
            border-top: 1px solid var(--border);
          }
          .info-strip-item {
            padding: 1rem 1rem;
          }
          .info-strip-icon-wrap {
            width: 36px;
            height: 36px;
            border-radius: 9px;
          }
        }

        @media (max-width: 400px) {
          .info-strip-item {
            padding: 0.85rem 0.75rem;
            gap: 0.55rem;
          }
          .info-strip-title {
            font-size: 0.78rem;
          }
          .info-strip-sub {
            font-size: 0.67rem;
          }
        }
      `}</style>
    </>
  )
}
