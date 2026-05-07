import { useState } from 'react'
import AIAnalysis from './AIAnalysis'
import DiffViewer from './DiffViewer'

function ResultCard({ result, index }) {
  const [showDiff, setShowDiff] = useState(false)

  const palette = {
    HIGH:   { color: 'var(--high)',   dim: 'var(--high-dim)',   label: '⚠ HIGH RISK'   },
    MEDIUM: { color: 'var(--medium)', dim: 'var(--medium-dim)', label: '◉ MEDIUM RISK' },
    LOW:    { color: 'var(--low)',    dim: 'var(--low-dim)',    label: '✓ LOW RISK'    },
  }
  const p = palette[result.level]

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderTop: `2px solid ${p.color}`,
        borderRadius: '12px',
        padding: '20px 22px',
        marginBottom: '14px',
        animation: `fadeUp 0.3s ease ${index * 0.08}s both`
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontWeight: 600, fontSize: '14px',
            color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{result.file1}</span>
            <span style={{ color: 'var(--text-hint)' }}>↔</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{result.file2}</span>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
            {result.matching_lines.length} matching line(s) found
          </p>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{
            fontSize: '36px', fontWeight: 700,
            color: p.color, lineHeight: 1,
            fontFamily: 'var(--font-mono)'
          }}>
            {result.similarity}%
          </p>
          <span style={{
            display: 'inline-block', marginTop: '6px',
            padding: '3px 10px',
            background: p.dim,
            color: p.color,
            borderRadius: '6px',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-mono)'
          }}>
            {p.label}
          </span>
        </div>
      </div>

      {/* AI analysis */}
      <AIAnalysis explanation={result.explanation} />

      {/* diff toggle */}
      <button
        onClick={() => setShowDiff(!showDiff)}
        style={{
          marginTop: '14px',
          padding: '7px 16px',
          background: 'transparent',
          border: '1px solid var(--border-bright)',
          borderRadius: '8px',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.15s'
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        {showDiff ? '▲ Hide Diff' : '▼ Show Side-by-Side Diff'}
      </button>

      {showDiff && (
        <DiffViewer
          code1={result.code1}
          code2={result.code2}
          matchingLines={result.matching_lines}
          file1={result.file1}
          file2={result.file2}
        />
      )}
    </div>
  )
}

export default ResultCard
