'use client'
import React, { ReactNode } from 'react'
import styles from './AdaptiveSlider.module.scss'
import style from '@/views/TestCase/SliderSection/SliderSection.module.scss'
import LeftBtnIcon from '@/views/TestCase/icon/LeftArrow.svg'
import RightBtnIcon from '@/views/TestCase/icon/RightArrow.svg'
import { useAdaptiveSlider } from './useAdaptiveSlider'

interface AdaptiveSliderProps<T> {
    items: T[]
    isLoading?: boolean
    loadingComponent?: ReactNode
    emptyComponent?: ReactNode
    children: (item: T, index: number) => ReactNode
    className?: string
    showControls?: boolean
}

export const AdaptiveSlider = <T,>({
                                       items,
                                       isLoading = false,
                                       loadingComponent,
                                       emptyComponent,
                                       children,
                                       className = '',
                                       showControls = true,
                                   }: AdaptiveSliderProps<T>) => {
    const {
        trackRef,
        nextSlide,
        prevSlide,
        renderItems,
    } = useAdaptiveSlider({ items, isLoading })

    // loading
    if (isLoading && loadingComponent) {
        return <>{loadingComponent}</>
    }

    // empty
    if (!isLoading && items.length === 0 && emptyComponent) {
        return <>{emptyComponent}</>
    }

    return (
        <div

            className={`${styles.sliderContainer} ${className}`}
        >
            {/* TRACK */}
            <div
                ref={trackRef}
                className={styles.sliderTrack}
                style={{
                    display: 'flex',
                    gap: '40px',
                    willChange: 'transform',
                }}
            >
                {renderItems.map((item, index) => (
                    <div className="slide" key={index}>
                        {children(item, index % items.length)}
                    </div>
                ))}
            </div>

            {/* CONTROLS */}
            {showControls && items.length > 1 && (
                <div className={style.directionBtn}>
                    <LeftBtnIcon onClick={prevSlide} />
                    <div className={style.divider} />
                    <RightBtnIcon onClick={nextSlide} />
                </div>
            )}
        </div>
    )
}