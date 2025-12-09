export const getIdFromPath = (path: string) => {
  const segments = path.split('/')
  const lastSegment = segments[segments.length - 1]
  const id = parseInt(lastSegment, 10)
  return isNaN(id) ? null : id
}