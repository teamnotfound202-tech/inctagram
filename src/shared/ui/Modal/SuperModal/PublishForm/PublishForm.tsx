import { useState } from 'react'
import styles from './PublishForm.module.scss'
import { TextArea } from '@/shared/ui'
import { filters, getFilterWithIntensity } from '@/shared/ui/Modal/SuperModal/constans/filters'
import Image from 'next/image'
import Pin from './../../icons/pin.svg'

type PublishFormProps = {
  images?: string[]
  selectedImage?: number
  onSelectImage?: (index: number) => void
  appliedFilter?: string
  filterIntensity?: number
}

const mockLocations = [
  { name: 'New York', details: 'Washington Square Park' },
  { name: 'New York', details: 'Central Park' },
  { name: 'New York', details: 'Brooklyn Bridge' },
]

export const PublishForm = ({
  images = [],
  selectedImage = 0,
  onSelectImage,
  appliedFilter,
  filterIntensity = 100,
}: PublishFormProps) => {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  const handleLocationSelect = (selectedLocation: string, details: string) => {
    setLocation(`${selectedLocation}, ${details}`)
    setShowLocationSuggestions(false)
  }

  const getFilterStyle = () => {
    if (!appliedFilter || appliedFilter === 'normal') return {}

    const filter = filters.find(f => f.name === appliedFilter)
    if (!filter) return {}

    const filterStyle = getFilterWithIntensity(filter.cssFilter, filterIntensity)
    return { filter: filterStyle}
  }

  if (images.length === 0) {
    return (
      <div className={styles.publishForm}>
        <div className={styles.noImageMessage}>No images to publish</div>
      </div>
    )
  }

  return (
    <div className={styles.publishForm}>
      <div className={styles.imageSection}>
        <div className={styles.imageContainer}>
          <Image
            src={images[selectedImage]}
            alt="Preview image"
            className={styles.previewImage}
            style={getFilterStyle()}
            width={600}
            height={400}
          />
        </div>

        {images.length > 1 && (
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

      <div className={styles.formSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarPlaceholder}>U</div>
          </div>
          <span className={styles.username}>URLProfile</span>
        </div>

        <div className={styles.descriptionSection}>
          <span className={styles.locationLabel}>Add publication descriptions</span>
          <TextArea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={styles.descriptionInput}
            maxLength={500}
          />
          <div className={styles.characterCount}>{description.length}/500</div>
        </div>

        <div className={styles.locationSection}>
          <label className={styles.locationLabel}>Add location</label>
          <div className={styles.locationInputContainer}>
            <input
              type="text"
              placeholder="New York"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onFocus={() => setShowLocationSuggestions(true)}
              className={styles.locationInput}
            />
            <button className={styles.locationIcon}><Pin/></button>
          </div>

          {showLocationSuggestions && (
            <div className={styles.locationSuggestions}>
              {mockLocations.map((loc, index) => (
                <button
                  key={index}
                  className={styles.locationSuggestion}
                  onClick={() => handleLocationSelect(loc.name, loc.details)}
                >
                  <div className={styles.locationName}>{loc.name}</div>
                  <div className={styles.locationDetails}>{loc.details}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
