function DiffViewer({ code1, code2, matchingLines, file1, file2 }) {
  const lines1 = code1.split('\n')
  const lines2 = code2.split('\n')

  const matchedLeft  = new Set(matchingLines.map(m => m.line1))
  const matchedRight = new Set(matchingLines.map(m => m.line2))

  function renderLines(lines, matchedSet) {
    return lines.map((line, i) => {
      const lineNum  = i + 1
      const isMatch  = matchedSet.has(lineNum)
      return (
        <div key={i} style={{
          display: 'flex',
          background: isMatch ? 'var(--match-hl)' : 'transparent',
          borderLeft: isMatch ? '2px solid var(--medium)' : '2px solid transparent',
          minHeight: '22px',
          transition: 'background 0.1s'
        }}>
          <span style={{
            width: '36px', minWidth: '36px',
            textAlign: 'right', paddingRight: '10px',
            color: isMatch ? 'var(--medium)' : 'var(--text-hint)',
            userSelect: 'none', fontSize: '11px',
            lineHeight: '22px', fontFamily: 'var(--font-mono)'
          }}>
            {lineNum}
          </span>
          <pre style={{
            margin: 0, padding: '0 10px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            lineHeight: '22px', flex: 1,
            color: isMatch ? 'var(--medium)' : 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: '12px'
          }}>
            {line || ' '}
          </pre>
        </div>
      )
    })
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <p style={{
        fontSize: '10px', color: 'var(--text-muted)',
        marginBottom: '8px', letterSpacing: '0.08em',
        fontFamily: 'var(--font-mono)', fontWeight: 700
      }}>
        ◈ SIDE-BY-SIDE DIFF — <span style={{ color: 'var(--medium)' }}>highlighted</span> lines match
      </p>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '2px', border: '1px solid var(--border)',
        borderRadius: '10px', overflow: 'hidden',
        maxHeight: '380px', overflowY: 'auto'
      }}>
        {/* left */}
        <div style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
          <div style={{
            padding: '8px 12px', background: 'var(--bg-hover)',
            borderBottom: '1px solid var(--border)',
            fontSize: '11px', color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontWeight: 700
          }}>
            📄 {file1}
          </div>
          <div style={{ padding: '6px 0' }}>{renderLines(lines1, matchedLeft)}</div>
        </div>

        {/* right */}
        <div style={{ background: 'var(--bg-card)' }}>
          <div style={{
            padding: '8px 12px', background: 'var(--bg-hover)',
            borderBottom: '1px solid var(--border)',
            fontSize: '11px', color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontWeight: 700
          }}>
            📄 {file2}
          </div>
          <div style={{ padding: '6px 0' }}>{renderLines(lines2, matchedRight)}</div>
        </div>
      </div>
    </div>
  )
}

export default DiffViewer
