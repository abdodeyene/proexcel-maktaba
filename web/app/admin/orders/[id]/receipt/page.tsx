import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OrderReceiptPage({ params }: { params: { id: string } }) {
  const orderId = parseInt(params.id, 10)
  if (isNaN(orderId)) return notFound()

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  })

  if (!order) return notFound()

  const settingsRaw = await prisma.setting.findMany()
  const settings: Record<string, string> = {}
  settingsRaw.forEach((s: { key: string, value: string | null }) => {
    if (s.value) settings[s.key] = s.value
  })

  const cart = (order.cart as any[]) || []

  return (
    <html>
      <head>
        <title>Bon de Commande #{order.orderNum}</title>
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            margin: 0;
            padding: 0;
            background: #e5e7eb;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Inter', system-ui, sans-serif;
          }
          .receipt-container {
            width: 1000px;
            height: 1000px;
            background: #ffffff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
            box-sizing: border-box;
            padding: 60px;
            color: #1f2937;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #f3f4f6;
            padding-bottom: 30px;
            margin-bottom: 40px;
          }
          .store-info h1 {
            margin: 0 0 10px 0;
            font-size: 2.5rem;
            color: ${settings.col_primary || '#2563eb'};
          }
          .store-info p { margin: 5px 0; color: #6b7280; font-size: 1.1rem; }
          .order-meta { text-align: right; }
          .order-meta h2 {
            margin: 0 0 10px 0;
            font-size: 2rem;
            color: #111827;
          }
          .order-meta p { margin: 5px 0; color: #6b7280; font-size: 1.1rem; }
          
          .customer-section {
            background: #f9fafb;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 40px;
            border: 1px solid #e5e7eb;
          }
          .customer-section h3 { margin: 0 0 15px 0; font-size: 1.3rem; color: #374151; text-transform: uppercase; letter-spacing: 1px; }
          .customer-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            font-size: 1.2rem;
          }
          .customer-info div { margin-bottom: 5px; }
          .customer-info strong { color: #111827; }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          th {
            text-align: left;
            padding: 15px 20px;
            background: ${settings.col_primary || '#2563eb'};
            color: white;
            font-size: 1.1rem;
            text-transform: uppercase;
          }
          td {
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 1.2rem;
          }
          .total-section {
            display: flex;
            justify-content: flex-end;
          }
          .total-box {
            background: #f9fafb;
            padding: 30px 50px;
            border-radius: 12px;
            text-align: right;
            border: 2px solid ${settings.col_primary || '#2563eb'};
          }
          .total-box .lbl { font-size: 1.2rem; color: #4b5563; margin-bottom: 10px; }
          .total-box .val { font-size: 2.5rem; font-weight: 800; color: ${settings.col_primary || '#2563eb'}; }

          .footer {
            position: absolute;
            bottom: 60px;
            left: 60px;
            right: 60px;
            text-align: center;
            color: #9ca3af;
            font-size: 1rem;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }

          @media print {
            body { background: transparent; }
            .receipt-container { box-shadow: none; }
            @page {
              size: 264.58mm 264.58mm; /* 1000px at 96dpi */
              margin: 0;
            }
          }
        ` }} />
      </head>
      <body>
        <div className="receipt-container">
          <div className="header">
            <div className="store-info">
              <h1>{settings.store_emoji || '📦'} {settings.store_name || 'Boutique'}</h1>
              <p>{settings.store_slogan}</p>
              <p>{settings.store_address}</p>
              <p>{settings.store_phone}</p>
            </div>
            <div className="order-meta">
              <h2>BON DE COMMANDE</h2>
              <p><strong>N° :</strong> #{order.orderNum}</p>
              <p><strong>Date :</strong> {new Date(order.date).toLocaleDateString('fr-FR')}</p>
              <p><strong>Statut :</strong> {order.status.toUpperCase()}</p>
            </div>
          </div>

          <div className="customer-section">
            <h3>Informations Client</h3>
            <div className="customer-info">
              <div><strong>Nom :</strong> {order.name}</div>
              <div><strong>Téléphone :</strong> {order.phone}</div>
              <div><strong>Ville :</strong> {order.city}</div>
              <div><strong>Adresse :</strong> {order.address}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Détails</th>
                <th style={{ textAlign: 'center' }}>Qté</th>
                <th style={{ textAlign: 'right' }}>Prix Unitaire</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 'bold', color: '#111827' }}>{item.title}</td>
                  <td style={{ color: '#6b7280' }}>{item.variant || '-'}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>{item.price.toFixed(2)} DH</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-section">
            <div className="total-box">
              <div className="lbl">Montant Total à Payer</div>
              <div className="val">{order.total.toFixed(2)} DH</div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '10px' }}>Paiement à la livraison</div>
            </div>
          </div>

          <div className="footer">
            Merci de votre confiance ! • Ce document est généré automatiquement. • {settings.store_name}
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        ` }} />
      </body>
    </html>
  )
}
