import useEmblaCarousel from 'embla-carousel-react'
import s from './Carousel.module.scss'
import {Images} from "@/features/postView/api/types";
import Image from "next/image";

type Props = {
    imagesArray: Images[]
}

export function Carousel({imagesArray}: Props) {
    const [emblaRef] = useEmblaCarousel()

    return (
        <div className={s.embla} ref={emblaRef}>
            <div className={s.embla__container}>
                {imagesArray.map(img => (
                    <Image key={img.url}
                           src={img.url}
                           alt={img.url}
                           className={s.embla__slide}
                           width={560}
                           height={560}
                    />
                ))}
                <div className={s.embla__slide}>Slide 1</div>
                <div className={s.embla__slide}>Slide 2</div>
                <div className={s.embla__slide}>Slide 3</div>
            </div>
        </div>
    )
}