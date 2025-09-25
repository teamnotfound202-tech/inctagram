import { useState } from 'react'
import Image from 'next/image'
import styles from './FiltersPanel.module.scss'

type Filter = {
  name: string
  displayName: string
  cssFilter: string
}

type FiltersPanelProps = {
  image?: string
  selectedFilter?: string
  onFilterSelect?: (filter: string, intensity?: number) => void
}

const filters: Filter[] = [
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

export const FiltersPanel = ({ image, selectedFilter = 'normal', onFilterSelect }: FiltersPanelProps) => {
  const [currentFilter, setCurrentFilter] = useState(selectedFilter)
  const [filterIntensity, setFilterIntensity] = useState(100)

  const handleFilterSelect = (filterName: string) => {
    setCurrentFilter(filterName)
    onFilterSelect?.(filterName, filterIntensity)
  }

  const handleIntensityChange = (intensity: number) => {
    setFilterIntensity(intensity)
    onFilterSelect?.(currentFilter, intensity)
  }

  const getFilterWithIntensity = (cssFilter: string, intensity: number) => {
    if (cssFilter === 'none' || intensity === 100) return cssFilter
    return `${cssFilter} opacity(${intensity / 100})`
  }

  // проверка если вдруг фотка к нам не пришла почемуто
  if (!image) {
    return (
      <div className={styles.filtersPanel}>
        <div className={styles.noImageMessage}>
          No image selected for filtering
        </div>
      </div>
    )
  }

  return (
    <div className={styles.filtersPanel}>
      <div className={styles.previewSection}>
        <div className={styles.previewContainer}>
          <Image
            src={image}
            alt="Preview"
            className={styles.previewImage}
            width={400}
            height={300}
            style={{
              filter: getFilterWithIntensity(
                filters.find(f => f.name === currentFilter)?.cssFilter || 'none',
                filterIntensity
              )
            }}
          />
        </div>

        {currentFilter !== 'normal' && (
          <div className={styles.intensityControl}>
            <label className={styles.intensityLabel}>Intensity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterIntensity}
              onChange={(e) => handleIntensityChange(Number(e.target.value))}
              className={styles.intensitySlider}
            />
            <span className={styles.intensityValue}>{filterIntensity}%</span>
          </div>
        )}
      </div>

      <div className={styles.filtersGrid}>
        {filters.map((filter) => (
          <div
            key={filter.name}
            className={`${styles.filterItem} ${currentFilter === filter.name ? styles.selected : ''}`}
            onClick={() => handleFilterSelect(filter.name)}
          >
            <div className={styles.filterPreview}>
              <Image
                src={image}
                alt={filter.displayName}
                className={styles.filterThumbnail}
                width={80}
                height={80}
                style={{ filter: filter.cssFilter }}
              />
            </div>
            <span className={styles.filterName}>{filter.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
