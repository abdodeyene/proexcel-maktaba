'use client'

type Props = {
  title:        string
  message:      string
  confirmLabel?: string
  loading?:     boolean
  error?:       string
  onConfirm:   () => void
  onCancel:    () => void
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Supprimer',
  loading = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={e => { if (!loading && e.target === e.currentTarget) onCancel() }}
    >
      <div
        style={{
          background: 'var(--a-card)',
          border: '1px solid var(--a-border)',
          borderRadius: '16px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(239,68,68,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', marginBottom: '1rem',
          }}>
            🗑️
          </div>
          <h3 style={{
            margin: 0, fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--a-text)', lineHeight: 1.3,
          }}>
            {title}
          </h3>
          <p style={{
            margin: '0.5rem 0 0', fontSize: '0.85rem',
            color: 'var(--a-text2)', lineHeight: 1.6,
          }}>
            {message}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            margin: '1rem 1.5rem 0',
            padding: '0.65rem 0.9rem',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--a-red, #ef4444)',
            fontWeight: 500,
          }}>
            ✗ {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: '0.65rem',
          padding: '1.25rem 1.5rem 1.5rem',
          justifyContent: 'flex-end',
        }}>
          <button
            disabled={loading}
            onClick={onCancel}
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '9px',
              border: '1.5px solid var(--a-border)',
              background: 'transparent', color: 'var(--a-text)',
              fontSize: '0.85rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            Annuler
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '9px',
              border: 'none',
              background: loading ? 'rgba(239,68,68,0.6)' : '#ef4444',
              color: '#fff',
              fontSize: '0.85rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'inherit',
            }}
          >
            {loading && (
              <span style={{
                display: 'inline-block', width: '13px', height: '13px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }} />
            )}
            {loading ? 'Suppression…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
