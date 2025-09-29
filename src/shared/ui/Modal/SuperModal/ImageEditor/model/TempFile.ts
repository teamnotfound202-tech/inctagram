export const createTempFile = (file: File, originalUrl?: string) => {
  const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  return {
    url: URL.createObjectURL(file),
    width: 0,
    height: 0,
    fileSize: file.size,
    createdAt: new Date().toISOString(),
    uploadId: `${tempId}-${file.name.replace(/[^a-z0-9]/gi, '-')}`,
  }
}
