import { Slider } from 'radix-ui'
import styles from'./ZoomCrop.module.scss'
import { ChangeEvent, useState } from 'react'

export const ZoomCrop = () => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomChange = (event:ChangeEvent<HTMLInputElement> ) => {
    setZoomLevel(Number(event.target.value));
    // Здесь также можно добавить логику изменения zoom
  };

  return (
    <div className={styles.zoomContainer}>
      <Slider.Root className={styles.Root} defaultValue={[50]} max={100} step={1}>
        <Slider.Track className={styles.Track}>
          <Slider.Range className={styles.Range} />
        </Slider.Track>
        <Slider.Thumb className={styles.Thumb} aria-label="Volume" />
      </Slider.Root>
    </div>
  );
}

