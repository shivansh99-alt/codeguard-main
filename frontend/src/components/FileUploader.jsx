import { useState } from 'react'
import axios from 'axios'

function FileUploader({ onSourcesChanged }) {
  const [dragging, setDragging]     = useState(false)
  const [sources, setSources]       = useState([])   // [{name, code, type:'file'|'url'}]
  const [urlInput, setUrlInput]     = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [urlError, setUrlError]     = useState('')

  function updateSources(newSources) {
    setSources(newSources)
    onSourcesChanged(newSources)
  }

  async function handleFiles(fileList) {
    const arr = Array.from(fileList).slice(0, 5 - sources.length)
    const newSources = [...sources]
    for (const f of arr) {
      const code = await f.text()
      newSources.push({ name: f.name, code, type: 'file', raw: f })
    }
    updateSources(newSources.slice(0, 5))
  }

  async function fetchFromUrl() {
    if (!urlInput.trim()) return
    setUrlError('')
    setUrlLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/fetch-url', { url: urlInput.trim() })
      const { filename, code } = res.data
      const newSources = [...sources, { name: filename, code, type: 'url', url: urlInput.trim() }]
      updateSources(newSources.slice(0, 5))
      setUrlInput('')
    } catch (err) {
      setUrlError(err.response?.data?.error || 'Could not fetch URL')
    } finally {
      setUrlLoading(false)
    }
  }

  function remove(index) {
    const updated = sources.filter((_, i) => i !== index)
    updateSources(updated)
  }

  const canAdd = sources.length < 5

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* drop zone */}
      {canAdd && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
          style={{
            border: `1.5px dashed ${dragging ? 'var(--accent)' : 'var(--border-bright)'}`,
            borderRadius: '12px',
            padding: '36px 24px',
            textAlign: 'center',
            background: dragging ? 'var(--accent-dim)' : 'var(--bg-card)',
            transition: 'all 0.2s',
            boxShadow: dragging ? `0 0 20px var(--accent-glow)` : 'none'
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>📂</div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            Drop code files here
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 14px' }}>
            .py · .js · .java · .c · .cpp — up to 5 sources total
          </p>
          <label style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'var(--accent)',
            color: '#000',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--font-body)'
          }}>
            Browse Files
            <input
              type="file" multiple
              accept=".py,.js,.java,.c,.cpp,.txt"
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}

      {/* URL input */}
      {canAdd && (
        <div>
          <p style={{
            fontSize: '11px', letterSpacing: '0.08em',
            color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600
          }}>
            OR FETCH FROM GITHUB / URL
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchFromUrl()}
              placeholder="https://github.com/user/repo/blob/main/script.py"
              style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-bright)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
            />
            <button
              onClick={fetchFromUrl}
              disabled={urlLoading || !urlInput.trim()}
              style={{
                padding: '10px 18px',
                background: urlLoading ? 'var(--bg-hover)' : 'var(--accent-dim)',
                border: '1px solid var(--accent)',
                borderRadius: '8px',
                color: 'var(--accent)',
                cursor: urlLoading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {urlLoading ? '...' : '⬇ Fetch'}
            </button>
          </div>
          {urlError && (
            <p style={{ color: 'var(--high)', fontSize: '12px', marginTop: '6px' }}>
              ⚠ {urlError}
            </p>
          )}
        </div>
      )}

      {/* source chips */}
      {sources.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {sources.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--bg-card)',
              border: `1px solid ${s.type === 'url' ? 'var(--accent-glow)' : 'var(--border)'}`,
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)'
            }}>
              <span>{s.type === 'url' ? '🔗' : '📄'} {s.name}</span>
              <span
                onClick={() => remove(i)}
                style={{ color: 'var(--text-hint)', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
              >×</span>
            </div>
          ))}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '6px 12px',
            color: 'var(--text-hint)',
            fontSize: '12px'
          }}>
            {sources.length}/5 sources
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader
