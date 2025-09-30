import s from "./PostImage.module.scss";
import {ImagePost} from "@/features/postView/api/types";
import EmblaCarousel from "@/features/postView/ui/PostSSR/PostView/PostImage/EmblaCarousel/EmblaCarousel";
import {EmblaOptionsType} from "embla-carousel";

type Props = {
    imageUrl?: string;
    images:ImagePost[]
}



export const PostImage = ({images}: Props) => {
     let imagesUrl = images.map(postImage=>postImage.url)
    imagesUrl=[...imagesUrl]

    const carouselOptions: EmblaOptionsType = {
        loop: true,
        align: 'center',
        skipSnaps: false,
        duration: 20, // скорость анимации
    };
    return (
        <div className={s.postImageWrapper}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <EmblaCarousel slides={imagesUrl} options={carouselOptions} />
            </div>
            {/*<ImageCarousel imagesArray={images}/>TODO: удалить лишние карусели и библиотеки*/}
            {/*<Carousel imagesArray={images}/>*/}
           {/* <img src={imageUrl} alt={'postImage'} className={s.postImage}/>*/}
        </div>
    );
};