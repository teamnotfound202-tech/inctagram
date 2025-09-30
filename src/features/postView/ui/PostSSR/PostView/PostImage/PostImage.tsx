import s from "./PostImage.module.scss";
import {Carousel} from "@/features/postView/ui/PostSSR/PostView/PostImage/Сarousel/Сarousel";
import {ImagePost} from "@/features/postView/api/types";
import ImageCarousel
    from "@/features/postView/ui/PostSSR/PostView/PostImage/ImageCarouselWithSwiper/ImageCarouselWithSwiper";

type Props = {
    imageUrl?: string;
    images:ImagePost[]
}

export const PostImage = ({images}: Props) => {
    return (
        <div className={s.postImageWrapper}>
            <ImageCarousel imagesArray={images}/>
            {/*<Carousel imagesArray={images}/>*/}
           {/* <img src={imageUrl} alt={'postImage'} className={s.postImage}/>*/}
        </div>
    );
};