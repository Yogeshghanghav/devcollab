const SIZES = { sm: 16, md: 24, lg: 32 }

export default function Spinner({ size = 'md', className = '' }) {
  const px = SIZES[size] || 24
  return (
    <div
      className={className}
      style={{
        width: px, height: px, borderRadius: '50%',
        border: '2px solid var(--color-bg-border)',
        borderTopColor: 'var(--color-accent)',
        animation: 'spin 0.7s linear infinite',
        display: 'inline-block', flexShrink: 0,
      }}
    />
  )
}