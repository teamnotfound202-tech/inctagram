'use client'

import s from './PostItem.module.scss'
import { Post } from '@/features/publicUserApi/types'
import  Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import { useRef, useState, MouseEvent, useEffect } from 'react'
import ArrowLeftIcon from '@/shared/assets/icons/arrowLeft.svg'
import ArrowRightIcon from '@/shared/assets/icons/arrowRight.svg'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  post: Post
}

export const PostItem = ({post}: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPrevDisabled = currentIndex === 0
  const isNextDisabled = currentIndex === post.images.length - 1
  const [path, setPath] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePrevClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    swiperRef.current?.slidePrev()
    setCurrentIndex(prevState => prevState - 1)
  }

  const handleNextClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    swiperRef.current?.slideNext()
    setCurrentIndex(prevState => prevState + 1)
  }

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('postId', post.id.toString());

    setPath(`${pathname}?${currentSearchParams.toString()}`);
  }, [pathname, searchParams, post.id]);

  return (
    <li  className={s.postItem}>
      <Link href={path}>
        {post.images.length > 1 && (
          <Swiper
            className={s.postSlider}
            modules={[Navigation]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={1}
          >
            {
              post.images.map((image, index) => (
                <SwiperSlide key={image.url} className={s.postSlide}>
                  <Image
                    src={image.url}
                    className={s.postImage}
                    alt={'post image'}
                    width={224}
                    height={228}
                    priority={index <= 7}
                  />
                </SwiperSlide>
              ))
            }
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
        )}
        { post.images.length === 1 &&  // если есть только одно изображение, показываем его без слайдера
          (
          <Image
            src={post.images[0]?.url}
            className={s.postImage}
            alt={'post image'}
            width={224}
            height={228}
            style={{
              width: '100%',
              height: 'auto' // сохраняет пропорции
            }}
            priority
          />
        )}
      </Link>
    </li>
  )
}