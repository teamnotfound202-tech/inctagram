import { useState } from 'react'
import styles from './PublishForm.module.scss'
import { TextArea } from '@/shared/ui'
import { filters, getFilterWithIntensity } from '@/shared/ui/Modal/SuperModal/constans/filters'
import Image from 'next/image'
import Pin from './../../icons/pin.svg'
import { Images } from '@/shared/lib/sсhemas/posts'
import BackArrow from '@/shared/ui/Modal/icons/backArrow.svg'
import ForwardArrow from '@/shared/ui/Modal/icons/forwardArrow.svg'
import Avatar from '@/entities/user/ui/Avatar/Avatar'

type PublishFormProps = {
  images?: Images[]
  selectedImage?: number
  onSelectImage?: (index: number) => void
  appliedFilter?: string
  filterIntensity?: number
  imageFilters?: {[key: number]: {filter: string, intensity: number}}
  onFormDataChange?: (data: {description: string, location: string}) => void
// для отображения аватара и юзернейма
//   user: {
//     userName: string
//     avatarUrl: string
//   }
}

const mockLocations = [
  { title: 'New York', place: 'Washington Square Park' },
  { title: 'New York', place: 'Central Park' },
  { title: 'New York', place: 'Brooklyn Bridge' },
]

export const PublishForm = ({
  images = [],
  selectedImage = 0,
  onSelectImage,
  imageFilters = {},
  onFormDataChange,
  // user,
}: PublishFormProps) => {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  // Уведомляем родительский компонент об изменениях в форме
  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    onFormDataChange?.({ description: value, location })
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    onFormDataChange?.({ description, location: value })
  }

  const handleLocationSelect = (selectedLocation: string, details: string) => {
    const newLocation = `${selectedLocation}, ${details}`
    setLocation(newLocation)
    setShowLocationSuggestions(false)
    onFormDataChange?.({ description, location: newLocation })
  }

  // Навигация по изображениям
  const handleNextImage = () => {
    if (selectedImage < images.length - 1) {
      onSelectImage?.(selectedImage + 1)
    }
  }
  const handlePrevImage = () => {
    if (selectedImage > 0) {
      onSelectImage?.(selectedImage - 1)
    }
  }

  const getFilterStyle = () => {
    // Получаем фильтр для текущего изображения
    const currentImageFilter = imageFilters[selectedImage]
    if (!currentImageFilter || currentImageFilter.filter === 'normal') return {}
    const filter = filters.find(f => f.name === currentImageFilter.filter)
    if (!filter) return {}
    const filterStyle = getFilterWithIntensity(filter.cssFilter, currentImageFilter.intensity)
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
            src={images[selectedImage]?.url || ''}
            alt="Preview image"
            className={styles.previewImage}
            style={getFilterStyle()}
            width={400}
            height={300}
          />
        </div>

        {/* Стрелочки навигации */}
        {images.length > 1 && (
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
            {/*Сюда закинуть аватар юзера а в спан юзернейм из супермодел где мы там его достанем потом*/}
            {/*<Avatar src={user.avatarUrl} alt={user.userName} size={'very_small'}/>*/}
          </div>
          <span className={styles.username}>URLProfile</span>
          {/*<span className={styles.username}>{user.userName}</span>*/}
        </div>

        <div className={styles.descriptionSection}>
          <span className={styles.locationLabel}>Add publication descriptions</span>
          <TextArea
            value={description}
            onChange={e => handleDescriptionChange(e.target.value)}
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
              onChange={e => handleLocationChange(e.target.value)}
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
                  onClick={() => handleLocationSelect(loc.title, loc.place)}
                >
                  <div className={styles.locationName}>{loc.title}</div>
                  <div className={styles.locationDetails}>{loc.place}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
