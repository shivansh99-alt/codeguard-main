function AIAnalysis({ explanation }) {
  if (!explanation) return null
  return (
    <div style={{
      marginTop: '16px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--accent-dim)',
      borderLeft: '3px solid var(--accent)',
      borderRadius: '8px',
      padding: '14px 16px'
    }}>
      <p style={{
        fontSize: '10px', color: 'var(--accent)',
        fontWeight: 700, letterSpacing: '0.1em',
        marginBottom: '8px', fontFamily: 'var(--font-mono)'
      }}>
        ◈ AI ANALYSIS — MISTRAL-7B via HUGGINGFACE
      </p>
      <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, fontSize: '13px' }}>
        {explanation}
      </p>
    </div>
  )
}

export default AIAnalysis
