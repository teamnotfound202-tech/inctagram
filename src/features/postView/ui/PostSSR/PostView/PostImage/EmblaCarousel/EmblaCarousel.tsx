'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './EmblaCarousel.module.scss';

type PropType = {
    slides: string[];
    options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    return (
        <div className={styles.embla}>
            <div className={styles.viewport} ref={emblaRef}>
                <div className={styles.container}>
                    {slides.map((image, index) => (
                        <div className={styles.slide} key={index}>
                            <img
                                className={styles.slideImg}
                                src={image}
                                alt={`Slide ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Кнопки навигации */}
            <button
                className={styles.prev}
                onClick={scrollPrev}
                type="button"
                aria-label="Previous slide"
            >
                <svg className={styles.buttonSvg} viewBox="0 0 532 532">
                    <path
                        fill="currentColor"
                        d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                    />
                </svg>
            </button>

            <button
                className={styles.next}
                onClick={scrollNext}
                type="button"
                aria-label="Next slide"
            >
                <svg className={styles.buttonSvg} viewBox="0 0 532 532">
                    <path
                        fill="currentColor"
                        d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 183.437 183.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.885 45.867-206.156 206.215-229.332 229.454Z"
                    />
                </svg>
            </button>

            {/* Пагинация (дотсы) */}
            <div className={styles.dots}>
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${
                            index === selectedIndex ? styles.dotSelected : ''
                        }`}
                        type="button"
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default EmblaCarousel;