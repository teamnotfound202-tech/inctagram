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
import { clsx } from 'clsx'

// Создаем отдельный компонент для содержимого ссылки
export function LinkContent({ post, isTrim }: { post: Post, isTrim?: string}) {
    const { pending } = useLinkStatus();
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
  console.log(isTrim)
    return (
        <>
            {pending && (
                <PostModal>
                    <Loader/>
                </PostModal>
            )}

            {post.images.length > 1 ? (
                <Swiper
                    className={s.postSlider}
                    modules={[Navigation]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={1}
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
                </Swiper>
            ) : (
                <Image
                    src={post.images[0]?.url}
                    className={imageClassName}
                    alt={'post image'}
                    width={224}
                    height={228}
                    style={{
                        width: '100%',
                        height: 'auto'
                    }}
                    priority
                />
            )}
        </>
    );
}