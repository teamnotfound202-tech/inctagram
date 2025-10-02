// утилита для фильтров
export async function applyFilterToImage(
  file: File,
  cssFilter: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = reader.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        canvas.width = img.width
        canvas.height = img.height

        ctx.filter = cssFilter
        ctx.drawImage(img, 0, 0, img.width, img.height)

        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('Canvas is empty'))
          resolve(new File([blob], file.name, { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.95)
      }

      img.onerror = reject
    }
    reader.onerror = reject
  })
}
