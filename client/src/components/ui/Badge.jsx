const STYLES = {
  admin:     { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' },
  developer: { background: 'rgba(37,99,235,0.15)',  color: '#60a5fa', border: '1px solid rgba(37,99,235,0.3)' },
  viewer:    { background: 'rgba(100,116,139,0.15)',color: '#94a3b8', border: '1px solid rgba(100,116,139,0.3)' },
  success:   { background: 'rgba(34,197,94,0.15)',  color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' },
  error:     { background: 'rgba(239,68,68,0.15)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
  warning:   { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' },
  info:      { background: 'rgba(37,99,235,0.15)',  color: '#60a5fa', border: '1px solid rgba(37,99,235,0.3)' },
  critical:  { background: 'rgba(220,38,38,0.25)',  color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' },
  high:      { background: 'rgba(234,88,12,0.15)',  color: '#fb923c', border: '1px solid rgba(234,88,12,0.3)' },
  medium:    { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' },
  low:       { background: 'rgba(100,116,139,0.15)',color: '#94a3b8', border: '1px solid rgba(100,116,139,0.3)' },
  resolved:  { background: 'rgba(34,197,94,0.15)',  color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' },
}

export default function Badge({ label, variant = 'info', className = '' }) {
  const s = STYLES[variant] || STYLES.info
  return (
    <span
      className={className}
      style={{
        ...s,
        fontSize: 11, fontWeight: 500,
        padding: '2px 6px', borderRadius: 4,
        display: 'inline-block', lineHeight: 1.5,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}