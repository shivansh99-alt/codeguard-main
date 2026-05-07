import { useState } from 'react'
import axios from 'axios'
import FileUploader from './components/FileUploader'
import ResultCard from './components/ResultCard'
import HistoryPanel from './components/HistoryPanel'

function saveToHistory(sources, results) {
  const raw     = localStorage.getItem('codeguard_history')
  const history = raw ? JSON.parse(raw) : []
  history.unshift({
    date:    new Date().toLocaleString(),
    files:   sources.map(s => s.name),
    results: results.map(r => ({
      file1: r.file1, file2: r.file2,
      similarity: r.similarity, level: r.level,
      matching_lines: r.matching_lines,
      explanation: r.explanation,
      // don't store full code in history — saves space
      code1: r.code1?.slice(0, 200) + '...',
      code2: r.code2?.slice(0, 200) + '...'
    }))
  })
  localStorage.setItem('codeguard_history', JSON.stringify(history.slice(0, 10)))
}

function App() {
  const [sources, setSources] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleCompare() {
    if (sources.length < 2) {
      setError('Add at least 2 files or URLs to compare.')
      return
    }
    setError('')
    setLoading(true)
    setResults([])

    const formData = new FormData()

    // separate file sources vs url sources
    const urlSources = []
    for (const src of sources) {
      if (src.type === 'file' && src.raw) {
        formData.append('files', src.raw)
      } else {
        urlSources.push({ filename: src.name, code: src.code })
      }
    }
    formData.append('url_sources', JSON.stringify(urlSources))

    try {
      const res = await axios.post('http://localhost:5000/compare', formData)
      setResults(res.data)
      saveToHistory(sources, res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Backend not reachable. Is Flask running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  const highCount   = results.filter(r => r.level === 'HIGH').length
  const mediumCount = results.filter(r => r.level === 'MEDIUM').length

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '52px 24px 80px' }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px', fontFamily: 'var(--font-mono)',
            color: 'var(--accent)', letterSpacing: '0.15em', fontWeight: 700
          }}>
            ◈ CODEGUARD
          </span>
          <span style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)',
            color: 'var(--text-hint)', background: 'var(--bg-card)',
            padding: '2px 8px', borderRadius: '4px',
            border: '1px solid var(--border)'
          }}>
            v1.0
          </span>
        </div>
        <h1 style={{
          fontSize: '32px', fontWeight: 700,
          letterSpacing: '-0.5px', lineHeight: 1.2,
          color: 'var(--text-primary)'
        }}>
          Code Plagiarism<br />
          <span style={{ color: 'var(--accent)' }}>Detector</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '14px', maxWidth: '480px' }}>
          Upload files or paste GitHub URLs. AI-powered analysis detects copied code and explains exactly why.
        </p>
      </div>

      {/* ── HISTORY ── */}
      <HistoryPanel onRestore={setResults} />

      {/* ── UPLOADER ── */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '16px'
      }}>
        <p style={{
          fontSize: '11px', fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)', letterSpacing: '0.1em',
          fontWeight: 700, marginBottom: '16px'
        }}>
          ◈ ADD SOURCES
        </p>
        <FileUploader onSourcesChanged={setSources} />
      </div>

      {/* ── COMPARE BUTTON ── */}
      <button
        onClick={handleCompare}
        disabled={loading || sources.length < 2}
        style={{
          display: 'block', width: '100%',
          padding: '15px',
          background: loading
            ? 'var(--bg-hover)'
            : sources.length < 2
              ? 'var(--bg-card)'
              : 'var(--accent)',
          color: loading || sources.length < 2 ? 'var(--text-muted)' : '#000',
          border: `1px solid ${sources.length < 2 ? 'var(--border)' : 'transparent'}`,
          borderRadius: '10px',
          fontSize: '15px', fontWeight: 700,
          cursor: loading || sources.length < 2 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          letterSpacing: '0.02em',
          fontFamily: 'var(--font-body)',
          boxShadow: !loading && sources.length >= 2 ? '0 0 24px var(--accent-glow)' : 'none'
        }}
      >
        {loading ? '⏳  Analyzing with AI...' : '⚡  Run Plagiarism Check'}
      </button>

      {/* ── ERROR ── */}
      {error && (
        <div style={{
          marginTop: '12px', padding: '12px 16px',
          background: 'var(--high-dim)', border: '1px solid var(--high)',
          borderRadius: '8px', color: 'var(--high)', fontSize: '13px'
        }}>
          ⚠ {error}
        </div>
      )}

      {/* ── RESULTS ── */}
      {results.length > 0 && (
        <div style={{ marginTop: '40px' }}>

          {/* summary bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px', flexWrap: 'wrap', gap: '12px'
          }}>
            <p style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 700
            }}>
              ◈ RESULTS — {results.length} PAIR(S)
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {highCount > 0 && (
                <span style={{
                  padding: '4px 12px', borderRadius: '6px',
                  background: 'var(--high-dim)', color: 'var(--high)',
                  fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)'
                }}>
                  {highCount} HIGH
                </span>
              )}
              {mediumCount > 0 && (
                <span style={{
                  padding: '4px 12px', borderRadius: '6px',
                  background: 'var(--medium-dim)', color: 'var(--medium)',
                  fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)'
                }}>
                  {mediumCount} MEDIUM
                </span>
              )}
            </div>
          </div>

          {results.map((r, i) => (
            <ResultCard key={i} result={r} index={i} />
          ))}
        </div>
      )}

    </div>
  )
}

export default App
