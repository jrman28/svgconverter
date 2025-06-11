export const convertSvgToImage = async (svgFile, format = 'png') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const svgData = e.target.result
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Set canvas dimensions to match SVG
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw SVG onto canvas
        ctx.drawImage(img, 0, 0)
        
        // Convert to desired format
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
        const quality = format === 'png' ? undefined : 0.9
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert SVG'))
          }
        }, mimeType, quality)
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load SVG'))
      }
      
      img.src = svgData
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read SVG file'))
    }
    
    reader.readAsDataURL(svgFile)
  })
} 