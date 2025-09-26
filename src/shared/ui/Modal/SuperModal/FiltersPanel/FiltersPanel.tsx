import { useState } from 'react'
import Image from 'next/image'
import styles from './FiltersPanel.module.scss'
import { filters, getFilterWithIntensity } from '@/shared/ui/Modal/SuperModal/constans/filters'
import { Images } from '@/shared/lib/sсhemas/posts'
import BackArrow from '../../icons/backArrow.svg'
import ForwardArrow from '../../icons/forwardArrow.svg'

type FiltersPanelProps = {
  images?: Images[]
  selectedImage?: number
  onSelectImage?: (index: number) => void
  selectedFilter?: string
  filterIntensity?: number
  onFilterSelect?: (filter: string, intensity?: number) => void
}

export const FiltersPanel = ({ 
  images, 
  selectedImage = 0,
  onSelectImage,
  selectedFilter = 'normal',
  filterIntensity = 100,
  onFilterSelect
}: FiltersPanelProps) => {
  // Используем пропсы вместо локального состояния
  // const currentFilter = selectedFilter
  // const currentIntensity = filterIntensity

  const handleFilterSelect = (filterName: string) => {
    onFilterSelect?.(filterName, filterIntensity)
  }

  const handleIntensityChange = (intensity: number) => {
    onFilterSelect?.(selectedFilter, intensity)
  }

  // Навигация по изображениям
  const handleNextImage = () => {
    if (images && selectedImage < images.length - 1) {
      onSelectImage?.(selectedImage + 1)
    }
  }
  const handlePrevImage = () => {
    if (images && selectedImage > 0) {
      onSelectImage?.(selectedImage - 1)
    }
  }

  // Проверка наличия изображений
  if (!images || images.length === 0) {
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
            src={images?.[selectedImage]?.url || ''}
            alt="Preview"
            className={styles.previewImage}
            width={400}
            height={300}
            style={{
              filter: getFilterWithIntensity(
                filters.find(f => f.name === selectedFilter)?.cssFilter || 'none',
                filterIntensity
              )
            }}
          />
          
          {/* Стрелочки навигации */}
          {images && images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                disabled={selectedImage === 0}
                className={`${styles.sliderButton} ${styles.backArrow}`}
              >
                <BackArrow />
              </button>
              <button
                onClick={handleNextImage}
                disabled={selectedImage === images.length - 1}
                className={`${styles.sliderButton} ${styles.forwardArrow}`}
              >
                <ForwardArrow />
              </button>
            </>
          )}

          {/* Точки навигации поверх изображения */}
          {images && images.length > 1 && (
            <div className={styles.imageNavigation}>
              <div className={styles.imageDots}>
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === selectedImage ? styles.active : ''}`}
                    onClick={() => onSelectImage?.(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
      <div className={styles.filtersGrid}>
        {filters.map((filter) => (
          <div
            key={filter.name}
            className={`${styles.filterItem} ${selectedFilter === filter.name ? styles.selected : ''}`}
            onClick={() => handleFilterSelect(filter.name)}
          >
            <div className={styles.filterPreview}>
              <Image
                src={images?.[selectedImage]?.url || ''}
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
        {selectedFilter !== 'normal' && (
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
    </div>
  )
}

