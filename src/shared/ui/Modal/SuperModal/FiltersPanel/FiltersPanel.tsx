import { useState } from 'react'
import Image from 'next/image'
import styles from './FiltersPanel.module.scss'
import { filters, getFilterWithIntensity } from '@/shared/ui/Modal/SuperModal/constans/filters'

type FiltersPanelProps = {
  image?: string
  selectedFilter?: string
  onFilterSelect?: (filter: string, intensity?: number) => void
}

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

