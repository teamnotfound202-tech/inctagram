export function getAuthorizationCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null

  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('code')
}
