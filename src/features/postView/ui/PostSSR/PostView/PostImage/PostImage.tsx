import s from "./PostImage.module.scss";
import {MouseEvent, useRef, useState} from "react";
import type {Swiper as SwiperType} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Navigation, Pagination} from "swiper/modules";
import Image from "next/image";
import ArrowLeftIcon from "@/shared/assets/icons/arrowLeft.svg";
import ArrowRightIcon from "@/shared/assets/icons/arrowRight.svg";
import {ImagePost} from "@/features/publicUserApi/types";


type Props = {
    images: ImagePost[]
}

export const PostImage = ({images}: Props) => {
    const imagesUrl = images.map(postImage => postImage.url)

    const swiperRef = useRef<SwiperType | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isPrevDisabled = currentIndex === 0
    const isNextDisabled = currentIndex === imagesUrl.length - 1

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

    const slideTo = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleDotClick = (index: number) => {
        slideTo(index)
        setCurrentIndex(index)
    }

    return (
        <div className={s.postImageWrapper}>
            {imagesUrl.length > 1 && (
                <Swiper
                    className={s.postSlider}
                    modules={[Navigation, Pagination, A11y]}
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
                    {
                        imagesUrl.map((image, index) => (
                            <SwiperSlide key={image} className={s.postSlide}>
                                <Image
                                    src={image}
                                    className={s.postImage}
                                    alt={'post image'}
                                    width={560}
                                    height={560}
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
                    <div className={s.pagination}>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`${s.paginationDot} ${
                                    index === currentIndex ? s.paginationDotActive : ''
                                }`}
                                onClick={() => handleDotClick(index)}
                                aria-label={`Перейти к слайду ${index + 1}`}
                                aria-current={index === currentIndex ? 'true' : 'false'}
                            />
                        ))}
                    </div>
                </Swiper>
            )}
            {imagesUrl.length === 1 &&  // если есть только одно изображение, показываем его без слайдера
                (
                    <Image
                        src={imagesUrl[0]}
                        className={s.postImage}
                        alt={'post image'}
                        width={560}
                        height={560}
                        style={{
                            width: '100%',
                            height: 'auto' // сохраняет пропорции
                        }}
                        priority
                    />
                )}
        </div>
    )
};