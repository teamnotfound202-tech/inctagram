import React from 'react'
import styles from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageEditor.module.scss'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
export const ModalSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <Skeleton
        baseColor="rgba(23, 23, 23, 0.6)"
        highlightColor="rgba(40, 40, 40, 0.8)"
        width={500}
        height={400}
      />
      <div className={styles.skeletonArea}>
        <div className={styles.skeletonItem}>
          {[...Array(2)].map((_, i) => (
            <Skeleton
              key={i}
              circle
              width={40}
              height={40}
              baseColor="rgba(23, 23, 23, 0.6)"
              highlightColor="rgba(40, 40, 40, 0.8)"
              style={{ margin: '0 5px' }}
            />
          ))}
        </div>
        <div className={styles.skeletonItem}>
          <Skeleton
            circle
            width={60}
            height={60}
            baseColor="rgba(23, 23, 23, 0.6)"
            highlightColor="rgba(40, 40, 40, 0.8)"
            style={{ margin: '0 5px' }}
          />
        </div>
      </div>
    </div>
  )
}

