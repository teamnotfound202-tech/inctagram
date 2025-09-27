import { Slider } from 'radix-ui'
import styles from'./ZoomCrop.module.scss'
import { ChangeEvent, useState } from 'react'
type Props = {
  handleChangeScale: (value:number) => void
}
export const ZoomCrop = ({handleChangeScale}:Props) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomChange = (value:number[]) => {
    handleChangeScale(value[0])

  };

  return (
    <div className={styles.zoomContainer}>
      <Slider.Root onValueChange={handleZoomChange} className={styles.Root} defaultValue={[1]} max={3} min={0.1} step={0.1}>
        <Slider.Track className={styles.Track}>
          <Slider.Range  className={styles.Range} />
        </Slider.Track>
        <Slider.Thumb className={styles.Thumb} aria-label="Volume" />
      </Slider.Root>
    </div>
  );
}

