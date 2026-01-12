'use client'

import s from './LinkContent.module.scss'
import {Post} from '@/features/publicUserApi/types'
import Image from 'next/image'
import {Swiper, SwiperSlide} from 'swiper/react';
import type {Swiper as SwiperType} from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import {MouseEvent, useRef, useState} from 'react'
import ArrowLeftIcon from '@/shared/assets/icons/arrowLeft.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrowRight.svg'
import {useLinkStatus} from 'next/link'
import {Loader} from "@/shared/ui/Loader/Loader";
import PostModal from "@/features/postView/ui/PostModal/PostModal";
import {clsx} from 'clsx'

// Создаем отдельный компонент для содержимого ссылки
export function LinkContent({post, isTrim}: { post: Post, isTrim?: string }) {
    const {pending} = useLinkStatus();
    const swiperRef = useRef<SwiperType | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isPrevDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex === post.images.length - 1;

    const imageClassName = clsx(s.postImage, {
        [s.trimPostImage]: isTrim === 'Show less'
    })

    const handlePrevClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        swiperRef.current?.slidePrev();
        setCurrentIndex(prevState => prevState - 1);
    };

    const handleNextClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        swiperRef.current?.slideNext();
        setCurrentIndex(prevState => prevState + 1);
    };

    const slideTo = (index: number) => {
      if (swiperRef.current) {
        swiperRef.current.slideTo(index);
      }
    };

    const handleDotClick = (e:MouseEvent<HTMLButtonElement>, index: number) => {
      e.preventDefault();
      slideTo(index)
      setCurrentIndex(index)
    }

    return (
        <>
            {pending && (
                <PostModal>
                    <Loader/>
                </PostModal>
            )}
            {post.images.length === 0 && <div className={s.imagePlug}>No image</div>}
            {post.images.length > 1 ? (
                <Swiper
                    className={s.postSlider}
                    modules={[Navigation]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={1}
                    pagination={{
                      clickable: true,
                      el: `${s.pagination}`,
                      bulletClass: s.bullet,
                      bulletActiveClass: s.bulletActive,
                    }}
                    a11y={{
                      prevSlideMessage: 'Previous slide',
                      nextSlideMessage: 'Next slide',
                      paginationBulletMessage: 'Go to slide {{index}}',
                    }}
                >
                    {post.images.map((image, index) => (
                        <SwiperSlide key={image.url} className={s.postSlide}>
                            <Image
                                src={image.url}
                                className={imageClassName}
                                alt={'post image'}
                                width={224}
                                height={228}
                                priority={index <= 7}
                                style={{height: 'auto'}}
                            />
                        </SwiperSlide>
                    ))}
                    <button
                        className={`${s.navigationButton} ${s.navigationButtonPrev}`}
                        onClick={handlePrevClick}
                        disabled={isPrevDisabled}
                    >
                        <ArrowLeftIcon/>
                    </button>
                    <button
                        className={`${s.navigationButton} ${s.navigationButtonNext}`}
                        onClick={handleNextClick}
                        disabled={isNextDisabled}
                    >
                        <ArrowRightIcon/>
                    </button>
                    <div className={s.pagination}>
                      {post.images.map((_, index) => (
                        <button
                          key={index}
                          className={`${s.paginationDot} ${
                            index === currentIndex ? s.paginationDotActive : ''
                          }`}
                          onClick={(e) => handleDotClick(e, index)}
                          aria-label={`Перейти к слайду ${index + 1}`}
                          aria-current={index === currentIndex ? 'true' : 'false'}
                        />
                      ))}
                    </div>
                </Swiper>
            ) : (post.images[0] &&
                <Image
                    src={post.images[0]?.url}
                    className={imageClassName}
                    alt={'post image'}
                    width={224}
                    height={228}
                    style={{height: 'auto'}}
                    priority
                />
            )}
        </>
    );
}