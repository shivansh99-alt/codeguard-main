function HistoryPanel({ onRestore }) {
  const raw     = localStorage.getItem('codeguard_history')
  const history = raw ? JSON.parse(raw) : []

  if (history.length === 0) return null

  function clearHistory() {
    localStorage.removeItem('codeguard_history')
    window.location.reload()
  }

  const levelColor = { HIGH: 'var(--high)', MEDIUM: 'var(--medium)', LOW: 'var(--low)' }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '18px 20px',
      marginBottom: '28px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <p style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>◈</span>
          PAST COMPARISONS
        </p>
        <button
          onClick={clearHistory}
          style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '6px', color: 'var(--text-muted)',
            padding: '4px 10px', cursor: 'pointer', fontSize: '11px',
            fontFamily: 'var(--font-body)'
          }}
        >
          Clear all
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {history.map((entry, i) => (
          <div
            key={i}
            onClick={() => onRestore(entry.results)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'border 0.15s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              {/* risk dots */}
              <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                {entry.results.map((r, j) => (
                  <div key={j} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: levelColor[r.level] || 'var(--text-hint)'
                  }} />
                ))}
              </div>
              <span style={{
                color: 'var(--text-muted)', fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {entry.files.join(', ')}
              </span>
            </div>
            <span style={{ color: 'var(--text-hint)', fontSize: '11px', flexShrink: 0, marginLeft: '12px' }}>
              {entry.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPanel
