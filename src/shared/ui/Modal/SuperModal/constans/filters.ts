export type Filter = {
  name: string
  displayName: string
  cssFilter: string
}

export const filters: Filter[] = [
  { name: 'normal', displayName: 'Normal', cssFilter: 'none' },
  { name: 'clarendon', displayName: 'Clarendon', cssFilter: 'contrast(1.2) saturate(1.35)' },
  { name: 'lark', displayName: 'Lark', cssFilter: 'contrast(0.9) brightness(1.1) saturate(1.2)' },
  { name: 'gingham', displayName: 'Gingham', cssFilter: 'brightness(1.05) hue-rotate(-10deg)' },
  { name: 'moon', displayName: 'Moon', cssFilter: 'grayscale(1) contrast(1.1) brightness(1.1)' },
  { name: 'valencia', displayName: 'Valencia', cssFilter: 'contrast(1.08) brightness(1.08) sepia(0.08)' },
  { name: 'juno', displayName: 'Juno', cssFilter: 'contrast(1.2) brightness(1.1) saturate(1.4) sepia(0.2)' },
  { name: 'ludwig', displayName: 'Ludwig', cssFilter: 'contrast(1.05) brightness(1.05) saturate(2)' },
  { name: 'aden', displayName: 'Aden', cssFilter: 'contrast(0.9) brightness(1.2) hue-rotate(-20deg) saturate(0.85)' },
  { name: 'perpetua', displayName: 'Perpetua', cssFilter: 'contrast(1.05) brightness(1.05) saturate(1.1) sepia(0.1)' },
  { name: 'amaro', displayName: 'Amaro', cssFilter: 'contrast(0.9) brightness(1.1) hue-rotate(-10deg) saturate(1.5)' },
  { name: 'mayfair', displayName: 'Mayfair', cssFilter: 'contrast(1.1) saturate(1.1) sepia(0.05)' }
]

export const getFilterWithIntensity = (cssFilter: string, intensity: number) => {
  if (cssFilter === 'none' || intensity === 100) return cssFilter

  // Simple implementation of intensity change through opacity
  return `${cssFilter} opacity(${intensity / 100})`
}