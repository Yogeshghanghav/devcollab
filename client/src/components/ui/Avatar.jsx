const COLORS = [
  '#7c3aed','#2563eb','#059669','#dc2626','#d97706','#0891b2','#c026d3',
]

function hashColor(name = '') {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return COLORS[h % COLORS.length]
}

const SIZES = {
  xs: { outer: 20, font: 9,  radius: 4 },
  sm: { outer: 28, font: 11, radius: 6 },
  md: { outer: 32, font: 13, radius: 7 },
  lg: { outer: 40, font: 15, radius: 9 },
}

export default function Avatar({ name = '?', size = 'md', online, className = '' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const color    = hashColor(name)
  const s        = SIZES[size] || SIZES.md

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: s.outer, height: s.outer }}>
      <div style={{
        width: s.outer, height: s.outer,
        background: color,
        borderRadius: s.radius,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: s.font, fontWeight: 600, color: '#fff',
        fontFamily: 'var(--font-display)',
        userSelect: 'none',
      }}>
        {initials}
      </div>
      {online !== undefined && (
        <span style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 10, height: 10, borderRadius: '50%',
          border: '2px solid var(--color-bg-surface)',
          background: online ? '#22c55e' : 'var(--color-text-muted)',
        }} />
      )}
    </div>
  )
}