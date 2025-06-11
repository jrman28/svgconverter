import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { convertSvgToImage } from './utils/converter'
import './App.css'

function App() {
  const [files, setFiles] = useState([])
  const [converting, setConverting] = useState(false)
  const [outputFormat, setOutputFormat] = useState('png')
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/svg+xml': ['.svg']
    },
    multiple: false
  })

  const handleConvert = async () => {
    if (files.length === 0) return
    
    setConverting(true)
    setError(null)
    
    try {
      const blob = await convertSvgToImage(files[0], outputFormat)
      const url = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `${files[0].name.split('.')[0]}.${outputFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          SVG Converter
        </h1>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            <div className="space-y-4">
              <p className="text-lg">Selected file: {files[0].name}</p>
              <div className="flex items-center justify-center gap-4">
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleConvert()
                  }}
                  disabled={converting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {converting ? 'Converting...' : 'Convert'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xl">Drag & drop your SVG file here</p>
              <p className="text-gray-400">or click to select a file</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="mt-8 text-center text-gray-400">
          <p>Supported formats: SVG</p>
          <p className="text-sm mt-2">Output formats: PNG, JPEG</p>
        </div>
      </div>
    </div>
  )
}

export default App
