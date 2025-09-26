import { useEffect, useState } from 'react'
import './App.css'
import sampleGangatiri from './assets/images/gangatiri-cattle.webp'
import sampleGir from './assets/images/gir_cow_65e8d0ae-3aa3-4b0a-a5cb-9b03a3c4770f_600x600.webp'

function App() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  function handleFileChange(event) {
    const selected = event.target.files && event.target.files[0]
    if (!selected) return

    setFile(selected)

    // Revoke previous URL to avoid memory leaks
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(selected)
    })

    // Reset previous results
    setResults(null)
  }

  async function handleSampleClick(sampleUrl, suggestedName) {
    try {
      // Reset previous results
      setResults(null)

      // Fetch the asset and create a File to mimic a user upload
      const response = await fetch(sampleUrl)
      const blob = await response.blob()
      const fileFromSample = new File([blob], suggestedName, { type: blob.type || 'image/webp' })

      setFile(fileFromSample)

      // Revoke previous url and set a new one for preview
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(fileFromSample)
      })

      // Also update the hidden/native input so Reset works intuitively
      const input = document.getElementById('cattleImage')
      if (input) input.value = ''
    } catch (err) {
      console.error('Failed to load sample image', err)
    }
  }

  function resetForm() {
    setFile(null)
    setResults(null)
    setIsAnalyzing(false)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return ''
    })
    const input = document.getElementById('cattleImage')
    if (input) input.value = ''
  }

  function analyze() {
    if (!previewUrl || isAnalyzing) return
    setIsAnalyzing(true)

    // Simulate analysis; replace with real API call
    setTimeout(() => {
      // Lightweight deterministic-ish score based on file size if available
      const base = file && file.size ? file.size % 100 : Math.floor(Math.random() * 100)
      const score = Math.max(35, Math.min(95, base))
      setResults({
        heightCm: 120 + (score % 10),
        lengthCm: 150 + ((score + 7) % 12),
        girthCm: 160 + ((score + 13) % 15),
        bodyCondition: score > 70 ? 'Good' : score > 55 ? 'Moderate' : 'Lean',
        score,
      })
      setIsAnalyzing(false)
    }, 1200)
  }

  useEffect(() => {
    return () => {
      // Cleanup preview URL on unmount
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return ''
      })
    }
  }, [])
  return (
    <>
      <header className="container py-3">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="h3 m-0">Cattle Trait Analyzer</h1>
            <p className="text-muted m-0">Upload a cattle image to estimate physical traits and score</p>
          </div>
        </div>
      </header>

      <main className="container pb-5">
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between">
                <span className="fw-600">Upload Image</span>
                <span className="badge bg-primary">Step 1</span>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="cattleImage" className="form-label">Cattle Image</label>
                  <input id="cattleImage" className="form-control" type="file" accept="image/*" onChange={(e) => handleFileChange(e)} />
                  <div className="form-text">Supported: JPG, PNG. Max ~5MB.</div>
                </div>

              <div className="mb-3">
                <div className="form-label mb-2">Or pick a sample</div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn p-0 border rounded overflow-hidden"
                    onClick={() => handleSampleClick(sampleGangatiri, 'gangatiri-cattle.webp')}
                    title="Use Gangatiri sample"
                    style={{ width: 96, height: 72 }}
                  >
                    <img src={sampleGangatiri} alt="Gangatiri sample" className="object-fit-cover w-100 h-100" />
                  </button>
                  <button
                    type="button"
                    className="btn p-0 border rounded overflow-hidden"
                    onClick={() => handleSampleClick(sampleGir, 'gir-cow.webp')}
                    title="Use Gir sample"
                    style={{ width: 96, height: 72 }}
                  >
                    <img src={sampleGir} alt="Gir sample" className="object-fit-cover w-100 h-100" />
                  </button>
                </div>
              </div>

                {previewUrl && (
                  <div className="mb-3">
                    <div className="ratio ratio-4x3 rounded overflow-hidden border">
                      <img src={previewUrl} alt="Selected cattle" className="object-fit-cover w-100 h-100" />
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" disabled={!previewUrl || isAnalyzing} onClick={analyze}>
                    {isAnalyzing ? 'Analyzing…' : 'Analyze Traits'}
                  </button>
                  <button className="btn btn-secondary" disabled={!previewUrl || isAnalyzing} onClick={resetForm}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <span className="fw-600">Results</span>
                <span className="badge bg-success">Step 2</span>
              </div>
              <div className="card-body">
                {!results && (
                  <div className="text-muted">No analysis yet. Upload an image and click Analyze.</div>
                )}

                {results && (
                  <>
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <div className="list-group">
                          <div className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Height</span>
                            <span className="fw-600">{results.heightCm} cm</span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Length</span>
                            <span className="fw-600">{results.lengthCm} cm</span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Girth</span>
                            <span className="fw-600">{results.girthCm} cm</span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Body Condition</span>
                            <span className="badge bg-info">{results.bodyCondition}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="border rounded p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                          <div className="display-5 fw-700 mb-1">{results.score}/100</div>
                          <div className="text-muted">Composite Trait Score</div>
                          <div className="progress w-100 mt-3" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={results.score}>
                            <div className="progress-bar bg-success" style={{ width: `${results.score}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
